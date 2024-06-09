import {MovieType} from "@prisma/client";

export class HdrMoviePartDto {
    name: string;
    link: string;
    releaseDate: string;
    type: MovieType;
    rating: number | null;
}
