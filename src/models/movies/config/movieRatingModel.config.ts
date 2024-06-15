import {Prisma} from "@prisma/client";

export const MovieRatingModelPConfig: Prisma.MovieRatingSelect = {
    id: true,
    movieId: true,
    countOfScopes: true,
    scope: true,

    profileId: true,
    providerName: true
};
