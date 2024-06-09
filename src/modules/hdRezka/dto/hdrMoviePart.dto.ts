import {MovieType} from "@prisma/client";

export class HdrMoviePartDto {
    name: string;
    link: string;
    current: boolean;
    releaseYear: number;
    type: MovieType;
    rating: number | null;
}
