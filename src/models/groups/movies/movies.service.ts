import {Injectable} from "@nestjs/common";
import { Prisma, PrismaPromise } from "@prisma/client";
import {PrismaService} from "@modules/prisma/prisma.service";
import {
    CreateGroupMovieDto,
    CreateGroupMovieAsyncDto,
    GroupMovieCreateTaskDto, GroupMovieDto, GroupMovieWatchedSeriaDto, GroupMovieRatingDto
} from "@models/groups/movies/dto"
import {
    GroupMovieCreateTaskPConfig,
    GroupMovieMinimalPConfig,
    GroupMovieModelPConfig,
    GroupMoviePConfig, GroupMovieRatingPConfig, GroupMovieWatchedSeriaPConfig
} from "@models/groups/movies/config";
import {GroupMovieMinimalDto} from "@models/groups/movies/dto/groupMovieMinimal.dto";
import {MovieDto} from "@models/movies/dto";


@Injectable()
export class GroupsMoviesModelService {
    private repo: Prisma.GroupMovieDelegate;
    private repoWatchedSeria: Prisma.GroupMovieWatchedSeriaDelegate;
    private repoRating: Prisma.GroupMovieRatingDelegate;
    private repoCreateTask: Prisma.GroupMovieCreateTaskDelegate;

    constructor(prismaService: PrismaService) {
        this.repo = prismaService.groupMovie;
        this.repoWatchedSeria = prismaService.groupMovieWatchedSeria;
        this.repoRating = prismaService.groupMovieRating;
        this.repoCreateTask = prismaService.groupMovieCreateTask;
    }

    // Movie

    create(creatorId: number, groupId: number, movieId: number, data: CreateGroupMovieDto): PrismaPromise<GroupMovieDto> {
        return this.repo.create({
            data: {
                group: { connect: { id: groupId } },
                movie: { connect: { id: movieId } },
                creator: { connect: { id: creatorId } },
                ...data
            },
            select: GroupMoviePConfig
        });
    }
    createAsync(creatorId: number, groupId: number, data: CreateGroupMovieAsyncDto): PrismaPromise<GroupMovieDto> {
        return this.repo.create({
            data: {
                group: { connect: { id: groupId } },
                creator: { connect: { id: creatorId } },
                taskCreate: { create: data }
            },
            select: GroupMoviePConfig
        });
    }

    updateMovieMoreToWatchById(id: number, moreToWatch: [number, number], isWatched = false) {
        return this.updateMovieById(id, {
            moreToWatch: {
                set: moreToWatch
            },
            isWatched
        });
    }
    updateMovieWatchedStatusById(id: number, isWatched: boolean) {
        return this.updateMovieById(id, {
            isWatched
        });
    }

    connectMovie(groupId: number, movie: MovieDto): PrismaPromise<GroupMovieDto> {
        const isOneMoreSeasons = movie.seasons.length;

        return this.repo.update({
            where: { id: groupId },
            data: {
                movie: { connect: { id: movie.id } },
                moreToWatch: {
                    set: [isOneMoreSeasons ? movie.seasons[0].series.length : 0, isOneMoreSeasons ? 1 : 0]
                }
            },
            select: GroupMoviePConfig
        });
    }

    getMovieByLink(link: string): PrismaPromise<GroupMovieDto> {
        return this.repo.findFirst({
            where: {
                OR: [
                    { taskCreate: { link } },
                    { movie: { link } }
                ]
            },
            select: GroupMoviePConfig
        });
    }
    getMovieByIdAndGroupId(id: number, groupId: number): PrismaPromise<GroupMovieDto> {
        return this.repo.findUnique({
            where: { id, groupId },
            select: GroupMoviePConfig
        });
    }
    getMinimalMovieByIdAndGroupId(id: number, groupId: number): PrismaPromise<GroupMovieMinimalDto> {
        return this.repo.findUnique({
            where: { id, groupId },
            select: GroupMovieMinimalPConfig
        });
    }

    getManyMinimalMoviesByGroupId(groupId: number): PrismaPromise<GroupMovieMinimalDto[]> {
        return this.repo.findMany({
            where: { groupId },
            select: GroupMovieMinimalPConfig
        });
    }

    deleteModelMovieById(id: number): PrismaPromise<GroupMovieMinimalDto> {
        return this.repo.delete({
            where: { id },
            select: GroupMovieModelPConfig
        });
    }

    private updateMovieById(id: number, data: Prisma.GroupMovieUpdateInput): PrismaPromise<GroupMovieDto> {
        return this.repo.update({
            where: { id },
            data,
            select: GroupMoviePConfig
        });
    }

    // WatchedSeria

    createManyWatchedSeriesByGroupMovieIdAndIds(groupMovieId: number, ids: number[]) {
        return this.repoWatchedSeria.createMany({
            data: ids.map(id => ({
                seriaId: id,
                groupMovieId
            }))
        });
    }

    getWatchedSeriaByIdAndGroupId(id: number, groupId: number): PrismaPromise<GroupMovieWatchedSeriaDto> {
        return this.repoWatchedSeria.findFirst({
            where: {
                seriaId: id,
                groupMovie: {
                    groupId
                }
            },
            select: GroupMovieWatchedSeriaPConfig
        });
    }

    getWatchedSeriesFilterIdByGroupMovieId(groupMovieId: number, filter: Prisma.IntFilter<"GroupMovieWatchedSeria">): PrismaPromise<GroupMovieWatchedSeriaDto[]> {
        return this.repoWatchedSeria.findMany({
            where: {
                seriaId: filter,
                groupMovieId
            },
            select: GroupMovieWatchedSeriaPConfig
        });
    }

    deleteManyWatchedSeriesByIds(ids: number[]) {
        return this.repoWatchedSeria.deleteMany({
            where: {
                seriaId: {
                    in: ids
                }
            }
        });
    }
    deleteAllWatchedSeriesByGroupMovieId(groupMovieId: number) {
        return this.repoWatchedSeria.deleteMany({
            where: {
                groupMovieId
            }
        });
    }

    // CreateTask

    setTaskErrorStatusById(id: number, newStatus: boolean): PrismaPromise<GroupMovieCreateTaskDto> {
        return this.repoCreateTask.update({
            where: { id },
            data: { isError: newStatus },
            select: GroupMovieCreateTaskPConfig
        });
    }

    getTaskById(id: number): PrismaPromise<GroupMovieCreateTaskDto> {
        return this.repoCreateTask.findUnique({
            where: { id },
            select: GroupMovieCreateTaskPConfig
        });
    }
    getTaskByIdAndGroupId(id: number, groupId: number): PrismaPromise<GroupMovieCreateTaskDto> {
        return this.repoCreateTask.findUnique({
            where: { id, groupMovie: { groupId } },
            select: GroupMovieCreateTaskPConfig
        });
    }

    closeTaskById(id: number): PrismaPromise<GroupMovieCreateTaskDto> {
        return this.repoCreateTask.delete({
            where: { id },
            select: GroupMovieCreateTaskPConfig
        });
    }

    // Rating

    createRating(profileId: number, groupMovieId: number, scope: number): PrismaPromise<GroupMovieRatingDto> {
        return this.repoRating.create({
            data: {
                profile: { connect: { id: profileId } },
                groupMovie: { connect: { id: groupMovieId } },
                scope
            },
            select: GroupMovieRatingPConfig
        });
    }

    updateRatingScopeById(id: number, scope: number): PrismaPromise<GroupMovieRatingDto> {
        return this.repoRating.update({
            where: { id },
            data: { scope },
            select: GroupMovieRatingPConfig
        });
    }

    getRatingByGroupMovieIdAndProfileId(groupMovieId: number, profileId: number): PrismaPromise<GroupMovieRatingDto> {
        return this.repoRating.findUnique({
            where: {
                profileId_groupMovieId: {
                    profileId,
                    groupMovieId
                }
            },
            select: GroupMovieRatingPConfig
        })
    }
}
