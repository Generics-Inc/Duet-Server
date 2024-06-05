import { Injectable } from '@nestjs/common';
import {Prisma, Movie} from "@prisma/client";
import {MovieIncludes, OmitMultiple} from "@root/types";
import {PrismaService} from "@modules/prisma/prisma.service";

@Injectable()
export class MoviesModelService {
    private include: Prisma.MovieInclude = {
        group: true,
        tags: true,
        seasons: {
            include: {
                series: true
            }
        }
    };

    constructor(private prismaService: PrismaService) {}

    createMovie(profileId: number, groupId: number, data: OmitMultiple<Prisma.MovieCreateInput, ['group', 'profile']>) {
        return this.prismaService.movie.create({
            data: {
                profile: { connect: { id: profileId } },
                group: { connect: { id: groupId } },
                ...data
            }
        });
    }

    updateMoviePhotoById(id: number, photo?: string) {
        return this.prismaService.movie.update({
            where: { id },
            data: { photo }
        });
    }

    getMovieById<E extends boolean = false>(id: number, extend?: E) {
        return this.getUniqueMovie<E>({ id }, extend);
    }
    getMovieByIdAndGroupId<E extends boolean = false>(id: number, groupId: number, extend?: E) {
        return this.getUniqueMovie<E>({ id, groupId }, extend);
    }

    getMoviesByGroupId<E extends boolean = false>(groupId: number, extend?: E) {
        return this.getMovies<E>({ groupId }, extend);
    }

    deleteMovieByIdAndGroupId(id: number, groupId: number) {
        return this.prismaService.movie.delete({
            where: { id, groupId }
        });
    }

    private async getMovie<E extends boolean = false>(where?: Prisma.MovieWhereInput, extend?: E) {
        return (await this.prismaService.movie.findFirst({
            where,
            include: extend ? this.include : undefined
        })) as unknown as E extends true ? MovieIncludes : Movie;
    }
    private async getUniqueMovie<E extends boolean = false>(where?: Prisma.MovieWhereUniqueInput, extend?: E) {
        return (await this.prismaService.movie.findUnique({
            where,
            include: extend ? this.include : undefined
        })) as unknown as E extends true ? MovieIncludes : Movie;
    }
    private async getMovies<E extends boolean = false>(where?: Prisma.MovieWhereInput, extend?: E) {
        return (await this.prismaService.movie.findMany({
            where,
            include: extend ? this.include : undefined
        })) as unknown as E extends true ? MovieIncludes[] : Movie[];
    }
}
