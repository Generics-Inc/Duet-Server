import { Injectable } from '@nestjs/common';
import {MovieSeason, Prisma} from "@prisma/client";
import {MovieSeasonIncludes} from "@root/types";
import {PrismaService} from "@modules/prisma/prisma.service";


@Injectable()
export class MoviesSeasonsModelService {
    private include: (keyof Prisma.MovieSeasonInclude)[] = ['movie', 'series'];

    constructor(private prismaService: PrismaService) {}

    getSeasonsByGroupId<E extends boolean = false>(groupId: number) {
        return this.getSeasons<E>({ movie: { groupId } });
    }

    private async getSeason<E extends boolean = false>(where?: Prisma.MovieSeasonWhereInput, extend?: E) {
        return (await this.prismaService.movieSeason.findFirst({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? MovieSeasonIncludes : MovieSeason;
    }
    private async getUniqueSeason<E extends boolean = false>(where?: Prisma.MovieSeasonWhereUniqueInput, extend?: E) {
        return (await this.prismaService.movieSeason.findUnique({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? MovieSeasonIncludes : MovieSeason;
    }
    private async getSeasons<E extends boolean = false>(where?: Prisma.MovieSeasonWhereInput, extend?: E) {
        return (await this.prismaService.movieSeason.findMany({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? MovieSeasonIncludes[] : MovieSeason[];
    }
}
