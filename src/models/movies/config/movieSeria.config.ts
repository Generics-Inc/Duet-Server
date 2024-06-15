import { Prisma } from "@prisma/client";

export const MovieSeriaPConfig: Prisma.MovieSeriaSelect = {
    id: true,
    seasonId: true,
    number: true,
    name: true,
    releaseDate: true,
};
