import {MovieType} from "@prisma/client";

export type HdrSearchValueDto = {
    name: string;
    addName: string;
    url: string;
    type: MovieType;
    rating: number | null;
}
