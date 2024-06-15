import {Prisma} from "@prisma/client";

export const MovieMinimalPConfig: Prisma.MovieSelect = {
    id: true,
    name: true,
    type: true,
    photo: true,
    updatedAt: true,
    createdAt: true,

    creatorId: true,
    originalName: true,
};
