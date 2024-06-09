import {MovieType} from "@prisma/client";
import {HdrMovieRatingDto, HdrMoviePartDto, HdrMovieSeasonDto} from "../dto";

export class HdrMovieDto {
    name: string;
    originalName: string;
    slogan: string;
    link: string;
    photo: string;
    releaseDate: Date;
    country: string;
    ageRating: number;
    time: number;
    description: string;
    type: MovieType;

    ratings: HdrMovieRatingDto[];
    genres: string[];
    parts: HdrMoviePartDto[];
    seasons: HdrMovieSeasonDto[];

}
