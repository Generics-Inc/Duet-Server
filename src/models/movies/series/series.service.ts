import { Injectable } from '@nestjs/common';
import {MovieSeria, Prisma} from "@prisma/client";
import {MovieSeriaIncludes} from "@root/types";
import {PrismaService} from "@modules/prisma/prisma.service";

@Injectable()
export class MoviesSeriesModelService {
    private include: (keyof Prisma.MovieSeriaInclude)[] = ['season'];

    constructor(private prismaService: PrismaService) {}

    getSeriesByGroupId<E extends boolean = false>(groupId: number) {
        return this.getSeries<E>({ season: { movie: { groupId } } });
    }

    private async getSeria<E extends boolean = false>(where?: Prisma.MovieSeriaWhereInput, extend?: E) {
        return (await this.prismaService.movieSeria.findFirst({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? MovieSeriaIncludes : MovieSeria;
    }
    private async getUniqueSeria<E extends boolean = false>(where?: Prisma.MovieSeriaWhereUniqueInput, extend?: E) {
        return (await this.prismaService.movieSeria.findUnique({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? MovieSeriaIncludes : MovieSeria;
    }
    private async getSeries<E extends boolean = false>(where?: Prisma.MovieSeriaWhereInput, extend?: E) {
        return (await this.prismaService.movieSeria.findMany({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? MovieSeriaIncludes[] : MovieSeria[];
    }
}
