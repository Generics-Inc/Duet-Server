import {Prisma} from "@prisma/client";

export const GroupMovieCreateTaskModelPConfig: Prisma.GroupMovieCreateTaskSelect  = {
    id: true,
    groupMovieId: true,
    link: true,
    name: true,
    addName: true,
    type: true,
    isError: true,
    createdAt: true,
    updatedAt: true
};
