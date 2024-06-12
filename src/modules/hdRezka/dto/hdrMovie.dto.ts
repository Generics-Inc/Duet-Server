import {MovieType} from "@prisma/client";
import {HdrMovieRatingDto, HdrMoviePartDto, HdrMovieSeasonDto} from "../dto";

export class HdrMovieDto {
    name: string;
    link: string;
    photo: string;
    description: string;
    releaseDate: Date;
    country: string;
    ageRating: number;
    time: number;

    type: MovieType;
    originalName?: string;
    slogan?: string;

    genres: string[];
    ratings: HdrMovieRatingDto[];
    parts: HdrMoviePartDto[];
    seasons: HdrMovieSeasonDto[];

}
