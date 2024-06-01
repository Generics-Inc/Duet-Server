import { Injectable } from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {MovieTag, Prisma} from "@prisma/client";
import {MovieTagIncludes} from "@root/types";

@Injectable()
export class MoviesTagsModelService {
    private include: (keyof Prisma.MovieTagInclude)[] = ['movies', 'group', 'profile'];

    constructor(private prismaService: PrismaService) {}

    private async getTag<E extends boolean = false>(where?: Prisma.MovieTagWhereInput, extend?: E) {
        return (await this.prismaService.movieTag.findFirst({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? MovieTagIncludes : MovieTag;
    }
    private async getUniqueTag<E extends boolean = false>(where?: Prisma.MovieTagWhereUniqueInput, extend?: E) {
        return (await this.prismaService.movieTag.findUnique({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? MovieTagIncludes : MovieTag;
    }
    private async getTags<E extends boolean = false>(where?: Prisma.MovieTagWhereInput, extend?: E) {
        return (await this.prismaService.movieTag.findMany({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? MovieTagIncludes[] : MovieTag[];
    }
}
