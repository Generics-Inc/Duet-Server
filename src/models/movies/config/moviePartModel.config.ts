import {Prisma} from "@prisma/client";

export const MoviePartModelPConfig: Prisma.MoviePartSelect = {
    link: true,
    releaseYear: true,
    name: true,
    type: true,
    current: true,

    rating: true,
    partsListId: true,
    movieId: true,
};
