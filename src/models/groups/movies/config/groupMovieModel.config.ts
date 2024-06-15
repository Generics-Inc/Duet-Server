import { Prisma } from "@prisma/client";

export const GroupMovieModelPConfig: Prisma.GroupMovieSelect = {
    id: true,
    groupId: true,
    creatorId: true,
    isWatched: true,
    moreToWatch: true,
    createdAt: true,
    updatedAt: true,

    movieId: true
};
