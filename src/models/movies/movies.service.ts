import { Injectable } from '@nestjs/common';
import {PrismaService} from "@modules/prisma/prisma.service";
import {Prisma, PrismaPromise} from '@prisma/client';
import {
    CreateMovieModelDto,
    CreateMoviePartDto,
    MovieDto,
    MoviePartsListDto, MovieRatingDto,
    MovieSeriaDto
} from "@models/movies/dto";
import {CreateMovieModelExtendDto} from "@models/movies/dto/createMovieModelExtend.dto";
import {MoviePartsListPConfig, MoviePConfig, MovieRatingPConfig, MovieSeriaPConfig} from "@models/movies/config";


@Injectable()
export class MoviesModelService {
    private repo: Prisma.MovieDelegate;
    private repoSeasons: Prisma.MovieSeasonDelegate;
    private repoSeries: Prisma.MovieSeriaDelegate;
    private repoPart: Prisma.MoviePartDelegate;
    private repoPartsList: Prisma.MoviePartsListDelegate;
    private repoRating: Prisma.MovieRatingDelegate;

    constructor(prismaService: PrismaService) {
        this.repo = prismaService.movie;
        this.repoSeasons = prismaService.movieSeason;
        this.repoSeries = prismaService.movieSeria;
        this.repoPart = prismaService.moviePart;
        this.repoPartsList = prismaService.moviePartsList;
        this.repoRating = prismaService.movieRating;
    }

    async createMovie(profileId: number, data: CreateMovieModelDto): Promise<MovieDto> {
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
        });
    }
    async createMovieExtend(data: CreateMovieModelExtendDto): Promise<MovieDto> {
        const parts = await this.upsertPartList(data.parts);

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
            genres: data.genres,
            partsList: { connect: { id: parts.id } }
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
            });
        } else {
            return this.repo.create({
                data: {
                    ...createMovieData,
                    photo: 'loading',
                    ratings: {
                        create: [
                            ...data.ratings,
                            {
                                providerName: 'Duet',
                                countOfScopes: 0,
                                scope: 0
                            }
                        ]
                    },
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
            });
        }
    }

    updateMoviePhotoById(id: number, photo: string): PrismaPromise<MovieDto> {
        return this.repo.update({
            where: { id },
            data: { photo },
            select: MoviePConfig
        });
    }

    getMovieById(id: number): PrismaPromise<MovieDto> {
        return this.repo.findUnique({
            where: { id },
            select: MoviePConfig
        }) as PrismaPromise<MovieDto>;
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

    // Series

    getSeriaByIdAndGroupMovieId(id: number, groupMovieId: number): PrismaPromise<MovieSeriaDto> {
        return this.repoSeries.findUnique({
            where: {
                id,
                season: {
                    movie: {
                        groupsAdded: {
                            some: {
                                id: groupMovieId
                            }
                        }
                    }
                }
            },
            select: MovieSeriaPConfig
        });
    }

    getManySeriesFilterIdByGroupMovieId(groupMovieId: number, filter: Prisma.IntFilter<"MovieSeria">): PrismaPromise<MovieSeriaDto[]> {
        return this.repoSeries.findMany({
            where: {
                id: filter,
                season: {
                    movie: {
                        groupsAdded: {
                            some: {
                                id: groupMovieId
                            }
                        }
                    }
                }
            },
            select: MovieSeriaPConfig
        });
    }

    // Ratings

    updateRatingScopeById(id: number, scope: number, countOfScopes?: number): PrismaPromise<MovieRatingDto> {
        return this.repoRating.update({
            where: { id },
            data: {
                scope,
                countOfScopes
            },
            select: MovieRatingPConfig
        });
    }

    getRatingByProviderNameAndMovieId(providerName: string, movieId: number): PrismaPromise<MovieRatingDto> {
        return this.repoRating.findUnique({
            where: {
                movieId_providerName: {
                    movieId,
                    providerName
                }
            },
            select: MovieRatingPConfig
        });
    }
}
