import { Injectable } from '@nestjs/common';
import {PrismaService} from "@modules/prisma/prisma.service";
import {Prisma} from '@prisma/client';
import {CreateMovieModelDto, CreateMoviePartDto, MovieDto, MoviePartsListDto} from "@models/movies/dto";
import {CreateMovieModelExtendDto} from "@models/movies/dto/createMovieModelExtend.dto";
import {MoviePartsListPConfig, MoviePConfig} from "@models/movies/config";


@Injectable()
export class MoviesModelService {
    private repo: Prisma.MovieDelegate;
    private repoSeasons: Prisma.MovieSeasonDelegate;
    private repoSeries: Prisma.MovieSeriaDelegate;
    private repoPart: Prisma.MoviePartDelegate;
    private repoPartsList: Prisma.MoviePartsListDelegate;

    constructor(prismaService: PrismaService) {
        this.repo = prismaService.movie;
        this.repoSeasons = prismaService.movieSeason;
        this.repoSeries = prismaService.movieSeria;
        this.repoPart = prismaService.moviePart;
        this.repoPartsList = prismaService.moviePartsList;
    }

    async createMovie(profileId: number, data: CreateMovieModelDto) {
        const { seasons, ..._data } = data;

        return this.repo.create({
            data: {
                creator: { connect: { id: profileId }},
                ...(_data.type === 'FILM' ? {} : {
                    seasons: {
                        create: seasons.map((season, seasonI) => ({
                            number: season.number ?? seasonI,
                            releaseDate: season.releaseDate,
                            series: {
                                create: season.series.map((seria, seriaI) => ({
                                    number: seria.number ?? seriaI,
                                    name: seria.name,
                                    releaseDate: season.releaseDate
                                }))
                            }
                        }))
                    }
                }),
                ..._data,
            },
            select: MoviePConfig
        }) as unknown as Promise<MovieDto>;
    }
    async createMovieExtend(data: CreateMovieModelExtendDto) {
        await this.upsertPartList(data.parts);

        const createMovieData: Prisma.MovieCreateInput = {
            name: data.name,
            type: data.type,
            ageRating: data.ageRating,
            time: data.time,
            link: data.link,
            country: data.country,
            originalName: data.originalName,
            slogan: data.slogan,
            description: data.description,
            moderated: true,
            releaseDate: data.releaseDate,
            genres: data.genres
        }

        const movie = await this.repo.findUnique({ where: { link: data.link }});

        if (movie) {
            return this.repo.update({
                where: { id: movie.id },
                data: {
                    ...createMovieData,
                    ratings: {
                        upsert: data.ratings.map((rating) => ({
                            where: { movieId_providerName: { movieId: movie.id, providerName: rating.providerName } },
                            create: rating,
                            update: {
                                countOfScopes: rating.countOfScopes,
                                scope: rating.scope
                            }
                        }))
                    }
                },
                select: MoviePConfig
            }) as unknown as Promise<MovieDto>;
        } else {
            return this.repo.create({
                data: {
                    ...createMovieData,
                    photo: 'loading',
                    ratings: { create: data.ratings },
                    seasons: {
                        create: data.seasons.map((season, seasonI) => ({
                            number: season.number ?? seasonI,
                            releaseDate: season.releaseDate,
                            series: {
                                create: season.series.map((seria, seriaI) => ({
                                    number: seria.number ?? seriaI,
                                    name: seria.name,
                                    releaseDate: season.releaseDate
                                }))
                            }
                        }))
                    },
                    ...(data.parts.length ? { part: { connect: { link: data.link } } } : {})
                },
                select: MoviePConfig
            }) as unknown as Promise<MovieDto>;
        }
    }

    updateMoviePhotoById(id: number, photo: string) {
        return this.repo.update({
            where: { id },
            data: { photo },
        });
    }

    getMovieById(id: number) {
        return this.repo.findUnique({ where: { id } });
    }

    private async upsertPartList(parts: CreateMoviePartDto[]): Promise<MoviePartsListDto> {
        const buildPart = (data: CreateMoviePartDto) => ({
            releaseYear: data.releaseYear,
            name: data.name,
            link: data.link,
            type: data.type,
            rating: data.rating
        });

        const partsList = await this.repoPartsList.findFirst({
            where: {
                parts: {
                    some: {
                        link: {
                            in: parts.map(part => part.link)
                        }
                    }
                }
            }
        });
        if (partsList) {
            return this.repoPartsList.update({
                where: { id: partsList.id },
                data: {
                    parts: {
                        upsert: parts.map(part => ({
                            where: {link: part.link},
                            create: buildPart(part),
                            update: buildPart(part)
                        }))
                    }
                },
                select: MoviePartsListPConfig
            });
        } else {
            return this.repoPartsList.create({
                data: {
                    parts: {
                        create: parts.map(buildPart)
                    }
                },
                select: MoviePartsListPConfig
            });
        }
    }
}
