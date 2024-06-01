import { Injectable } from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {MovieSeria, Prisma} from "@prisma/client";
import {MovieSeriaIncludes} from "@root/types";

@Injectable()
export class MoviesSeriesModelService {
    private include: (keyof Prisma.MovieSeriaInclude)[] = ['season'];

    constructor(private prismaService: PrismaService) {}

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
