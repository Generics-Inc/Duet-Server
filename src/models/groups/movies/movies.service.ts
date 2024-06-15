import {Injectable} from "@nestjs/common";
import { Prisma, PrismaPromise } from "@prisma/client";
import {PrismaService} from "@modules/prisma/prisma.service";
import {
    CreateGroupMovieDto,
    CreateGroupMovieAsyncDto,
    GroupMovieCreateTaskDto, GroupMovieDto
} from "@models/groups/movies/dto"
import {GroupMovieCreateTaskPConfig, GroupMovieMinimalPConfig, GroupMoviePConfig} from "@models/groups/movies/config";
import {GroupMovieMinimalDto} from "@models/groups/movies/dto/groupMovieMinimal.dto";
import {MovieDto} from "@models/movies/dto";


@Injectable()
export class GroupsMoviesModelService {
    private repo: Prisma.GroupMovieDelegate;
    private repoTask: Prisma.GroupMovieCreateTaskDelegate;

    constructor(prismaService: PrismaService) {
        this.repo = prismaService.groupMovie;
        this.repoTask = prismaService.groupMovieCreateTask;
    }

    create(creatorId: number, groupId: number, movieId: number, data: CreateGroupMovieDto) {
        return this.repo.create({
            data: {
                group: { connect: { id: groupId } },
                movie: { connect: { id: movieId } },
                creator: { connect: { id: creatorId } },
                ...data
            }
        });
    }
    createAsync(creatorId: number, groupId: number, data: CreateGroupMovieAsyncDto) {
        return this.repo.create({
            data: {
                group: { connect: { id: groupId } },
                creator: { connect: { id: creatorId } },
                taskCreate: { create: data }
            },
            select: GroupMoviePConfig
        }) as unknown as PrismaPromise<GroupMovieDto>;
    }

    connectMovie(groupId: number, movie: MovieDto) {
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
        }) as unknown as PrismaPromise<GroupMovieDto>;
    }

    getMovieByLink(link: string) {
        return this.repo.findFirst({
            where: {
                OR: [
                    { taskCreate: { link } },
                    { movie: { link } }
                ]
            },
            select: GroupMoviePConfig
        }) as unknown as PrismaPromise<GroupMovieDto>;
    }
    getMovieByIdAndGroupId(id: number, groupId: number) {
        return this.repo.findUnique({
            where: { id, groupId },
            select: GroupMoviePConfig
        }) as unknown as PrismaPromise<GroupMovieDto>;
    }

    getManyMinimalMoviesByGroupId(groupId: number) {
        return this.repo.findMany({
            where: {groupId},
            select: GroupMovieMinimalPConfig
        }) as PrismaPromise<GroupMovieMinimalDto[]>;
    }

    deleteMovieById(id: number) {
        return this.repo.delete({ where: { id } });
    }

    setTaskErrorStatusById(id: number, newStatus: boolean): PrismaPromise<GroupMovieCreateTaskDto> {
        return this.repoTask.update({
            where: { id },
            data: { isError: newStatus },
            select: GroupMovieCreateTaskPConfig
        });
    }

    getTaskById(id: number): PrismaPromise<GroupMovieCreateTaskDto> {
        return this.repoTask.findUnique({
            where: { id },
            select: GroupMovieCreateTaskPConfig
        });
    }
    getTaskByMovieId(movieId: number): PrismaPromise<GroupMovieCreateTaskDto> {
        return this.repoTask.findUnique({
            where: { groupMovieId: movieId },
            select: GroupMovieCreateTaskPConfig
        });
    }
    getTaskByIdAndGroupId(id: number, groupId: number): PrismaPromise<GroupMovieCreateTaskDto> {
        return this.repoTask.findUnique({
            where: { id, groupMovie: { groupId } },
            select: GroupMovieCreateTaskPConfig
        });
    }

    closeTaskById(id: number) {
        return this.repoTask.delete({ where: { id }});
    }
}
