import { Injectable } from '@nestjs/common';
import {MoviesModelService} from "@models/movies/movies.service";
import {CreateMovieAsyncDto, CreateMovieDto} from "@modules/movies/dto";
import {TasksService} from "@modules/tasks/tasks.service";
import {UploadedPostFileReturn} from "@modules/app/decorators";
import {FilesService} from "@modules/files/files.service";
import {GroupsMoviesModelService} from "@models/groups/movies/movies.service";
import {utils} from "@root/helpers";
import {MovieAlreadyInGroupConflictException} from "@root/errors";
import {HdRezkaService} from "@modules/hdRezka/hdRezka.service";


@Injectable()
export class MoviesService {
    private utils = utils();

    constructor(
        private modelService: MoviesModelService,
        private groupsMoviesModelService: GroupsMoviesModelService,
        private hdRezkaService: HdRezkaService,
        private tasksService: TasksService,
        private filesService: FilesService
    ) {}

    getModel() {
        return this.modelService;
    }

    async createMovie(creatorId: number, groupId: number, { body, file }: UploadedPostFileReturn<CreateMovieDto>) {
        const { useAIGenerationPhoto, isWatched, ..._body } = body;

        const movie = await this.modelService.createMovie(creatorId, {
            ..._body,
            photo: 'loading'
        });
        const groupMovie = await this.groupsMoviesModelService.create(creatorId, groupId, movie.id, {
            moreToWatch: [_body.seasons?.[1 - 1].series.length ?? 0, 1],
            isWatched
        });

        if (file) {
            try {
                await this.modelService.updateMoviePhotoById(movie.id, await this.filesService.upload({
                    profileId: creatorId,
                    bucketName: 'movie',
                    fileName: 'main',
                    fileDir: movie.id.toString(),
                    file: file.buffer
                }));
            } catch (e) {
                await this.modelService.updateMoviePhotoById(movie.id, 'error');
            }
        } else if (useAIGenerationPhoto) {
            this.tasksService.sendMessageToXMLParserQueue({
                reqId: movie.id,
                type: 'image',
                text: movie.name
            });
        } else {
            await this.modelService.updateMoviePhotoById(movie.id, 'not set');
        }

        return groupMovie;
    }

    async createMovieAsync(creatorId: number, groupId: number, data: CreateMovieAsyncDto) {
        this.utils.ifEmptyGivesError(!await this.groupsMoviesModelService.getMovieByLink(data.link), MovieAlreadyInGroupConflictException);
        const groupMovie = await this.groupsMoviesModelService.createAsync(creatorId, groupId, data);

        this.tasksService.sendMessageToMovieParserQueue({
            taskId: groupMovie.taskCreate.id
        });

        return groupMovie;
    }

    searchMoviesByQuery(query: string) {
        return this.hdRezkaService.searchMovies(query);
    }
}
