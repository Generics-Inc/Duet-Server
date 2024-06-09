import {MovieType} from "@prisma/client";

export type hdrSearchValueDto = {
    name: string;
    addName: string;
    url: string;
    type: MovieType;
    rating: number | null;
}
