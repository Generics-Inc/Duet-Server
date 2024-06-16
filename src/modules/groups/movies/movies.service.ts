import {Injectable} from "@nestjs/common";
import {GroupsMoviesModelService} from "@models/groups/movies/movies.service";
import { utils } from "@root/helpers";
import {
    MovieIsNotReadyDividedException,
    MovieNotFoundException, MovieSeriaNotFoundException,
    MovieTaskNotFoundException,
    TaskIsAlreadyRunningConflictException,
    WatchedSeriaNotFoundException
} from "@root/errors";
import {TasksService} from "@modules/tasks/tasks.service";
import {MoviesModelService} from "@models/movies/movies.service";

@Injectable()
export class GroupsMoviesService  {
    private utils = utils();

    constructor(
        private modelService: GroupsMoviesModelService,
        private moviesModelService: MoviesModelService,
        private tasksService: TasksService
    ) {}

    getModel() {
        return this.modelService;
    }

    // Movie

    async setWatchedMovie(groupMovieId: number, groupId: number) {
        const groupMovie = await this.getReadyMovieByIdAndGroupId(groupMovieId, groupId);
        const isWatched = groupMovie.isWatched;
        const isOneMoreSeasons = groupMovie.movie.seasons.length && isWatched;

        if (isWatched) await this.modelService.deleteAllWatchedSeriesByGroupMovieId(groupMovieId);

        return this.modelService.updateMovieMoreToWatchById(
            groupMovieId,
            [isOneMoreSeasons ? groupMovie.movie.seasons[0].series.length : 0, isOneMoreSeasons ? 1 : 0],
            !isWatched
        );
    }

    async getMovieByIdAndGroupId(id: number, groupId: number) {
        const movie = this.utils.ifEmptyGivesError(await this.modelService.getMovieByIdAndGroupId(id, groupId), MovieNotFoundException);
        movie.movie?.partsList?.parts.forEach(part => part.link === movie.movie.link && (part.current = true));
        return movie;
    }
    async getReadyMovieByIdAndGroupId(id: number, groupId: number) {
        const groupMovie = await this.getMovieByIdAndGroupId(id, groupId);

        if (!groupMovie.movie) throw MovieIsNotReadyDividedException;

        return groupMovie;
    }
    async getMinimalMovieByIdAndGroupId(id: number, groupId: number) {
        return this.utils.ifEmptyGivesError(await this.modelService.getMinimalMovieByIdAndGroupId(id, groupId), MovieNotFoundException);
    }

    async deleteMovieByIdAndGroupId(id: number, groupId: number) {
        await this.getMovieByIdAndGroupId(id, groupId);
        return this.modelService.deleteModelMovieById(id);
    }

    // WatchedSeria

    async setWatchedSeria(id: number, groupMovieId: number, groupId: number) {
        const groupMovie = await this.getReadyMovieByIdAndGroupId(groupMovieId, groupId);
        let watchedSeriaId = (await this.modelService.getWatchedSeriaByIdAndGroupId(id, groupId))?.seriaId;
        let isCurrentDelete = false;

        await this.modelService.updateMovieWatchedStatusById(groupMovie.id, false);

        if (watchedSeriaId) {
            const watchedSeriesAfter = await this.modelService.getWatchedSeriesFilterIdByGroupMovieId(groupMovieId, {
                gt: watchedSeriaId
            });

            if (!watchedSeriesAfter.length && !groupMovie.isWatched) isCurrentDelete = true;

            await this.modelService.deleteManyWatchedSeriesByIds(isCurrentDelete ? [watchedSeriaId] : watchedSeriesAfter.map(seria => seria.seriaId));
        } else {
            watchedSeriaId = this.utils.ifEmptyGivesError(await this.moviesModelService.getSeriaByIdAndGroupMovieId(id, groupMovieId), MovieSeriaNotFoundException).id;
            const watchedSeriesBefore = await this.modelService.getWatchedSeriesFilterIdByGroupMovieId(groupMovieId, {
                lt: watchedSeriaId
            });
            const needToAddSeries = await this.moviesModelService.getManySeriesFilterIdByGroupMovieId(groupMovieId, {
                lte: watchedSeriaId,
                notIn: watchedSeriesBefore.map(seria => seria.seriaId)
            });
            await this.modelService.createManyWatchedSeriesByGroupMovieIdAndIds(groupMovieId, needToAddSeries.map(seria => seria.id));
        }

        const movieSeasons = groupMovie.movie.seasons;
        const activeSeason = movieSeasons.find(season => season.series.some(seria => seria.id === watchedSeriaId));
        const lastWatchedSeria = activeSeason.series.find(seria => seria.id === watchedSeriaId);

        const nextSeason = movieSeasons.find(season => season.number === activeSeason.number + 1);
        const moreSeriesToWatch = activeSeason.series.length - lastWatchedSeria.number + (isCurrentDelete ? 1 : 0);

        return this.modelService.updateMovieMoreToWatchById(
            groupMovieId,
            [moreSeriesToWatch || (nextSeason?.series.length ?? 0), moreSeriesToWatch ? activeSeason.number : (nextSeason?.number ?? 0)],
            moreSeriesToWatch ? false : !nextSeason
        );
    }

    async getWatchedSeriaByIdAndGroupId(id: number, groupId: number) {
        return this.utils.ifEmptyGivesError(await this.modelService.getWatchedSeriaByIdAndGroupId(id, groupId), WatchedSeriaNotFoundException);
    }

    // CreateTask

    async getTaskByIdAndGroupId(id: number, groupId: number) {
        return this.utils.ifEmptyGivesError(await this.modelService.getTaskByIdAndGroupId(id, groupId), MovieTaskNotFoundException);
    }

    async restartTaskByIdAndGroupId(id: number, groupId: number) {
        const task = await this.getTaskByIdAndGroupId(id, groupId);

        if (!task.isError) throw TaskIsAlreadyRunningConflictException;

        await this.modelService.setTaskErrorStatusById(id, false);
        return this.tasksService.sendMessageToMovieParserQueue({
            taskId: id
        });
    }

    // Rating

    async upsertRatingByGroupMovieIdAndGroupIdAndProfileId(groupMovieId: number, groupId: number, profileId: number, scope: number) {
        const groupMovie = await this.getReadyMovieByIdAndGroupId(groupMovieId, groupId);
        const movieRating = await this.moviesModelService.getRatingByProviderNameAndMovieId('Duet', groupMovie.movieId);
        const userRating = await this.modelService.getRatingByGroupMovieIdAndProfileId(groupMovieId, profileId);

        if (userRating) {
            const newScope = (movieRating.countOfScopes * movieRating.scope - userRating.scope + scope) / movieRating.countOfScopes;
            await this.moviesModelService.updateRatingScopeById(movieRating.id, newScope);
            return this.modelService.updateRatingScopeById(userRating.id, scope);
        } else {
            const newScope = (movieRating.countOfScopes * movieRating.scope + scope) / (movieRating.countOfScopes + 1);
            await this.moviesModelService.updateRatingScopeById(movieRating.id, newScope, movieRating.countOfScopes + 1);
            return this.modelService.createRating(profileId, groupMovieId, scope);
        }
    }
}
