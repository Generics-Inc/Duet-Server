import {MovieType} from "@prisma/client";

export class CreateMoviePartDto {
    releaseYear: number;
    name: string;
    link: string;
    type: MovieType;
    rating?: number;
}
