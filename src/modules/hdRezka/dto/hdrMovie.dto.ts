import {MovieType} from "@prisma/client";
import {HdrMovieRatingDto, HdrMoviePartDto, HdrMovieSeasonDto} from "../dto";

export class HdrMovieDto {
    name: string;
    link: string;
    photo: string;
    releaseDate: Date;
    country: string;
    ageRating: number;
    time: number;
    description: string;

    seasons: HdrMovieSeasonDto[];
    ratings: HdrMovieRatingDto[]
    parts: HdrMoviePartDto[]
    genres: string[];
    type: MovieType;

    slogan?: string;
    originalName?: string;
}
