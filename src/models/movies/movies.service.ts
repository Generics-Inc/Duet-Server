import { Injectable } from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {Prisma, Movie} from "@prisma/client";
import {MovieIncludes} from "@root/types";

@Injectable()
export class MoviesModelService {
    private include: (keyof Prisma.MovieInclude)[] = ['group', 'profile', 'tags', 'seasons'];

    constructor(private prismaService: PrismaService) {}

    private async getMovie<E extends boolean = false>(where?: Prisma.MovieWhereInput, extend?: E) {
        return (await this.prismaService.movie.findFirst({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? MovieIncludes : Movie;
    }
    private async getUniqueMovie<E extends boolean = false>(where?: Prisma.MovieWhereUniqueInput, extend?: E) {
        return (await this.prismaService.movie.findUnique({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? MovieIncludes : Movie;
    }
    private async getMovies<E extends boolean = false>(where?: Prisma.MovieWhereInput, extend?: E) {
        return (await this.prismaService.movie.findMany({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? MovieIncludes[] : Movie[];
    }
}
