import {MovieType} from "@prisma/client";

export class MoviePartModelDto {
    link: string;
    releaseYear: number;
    name: string;
    type: MovieType;
    current: boolean;

    rating?: number;
    partsListId?: number;
    movieId?: number;
}
