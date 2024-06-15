import { Prisma } from "@prisma/client";
import {MovieSeriaPConfig} from "./movieSeria.config";

export const MovieSeasonPConfig: Prisma.MovieSeasonSelect = {
    id: true,
    movieId: true,
    number: true,
    releaseDate: true,
    series: { select: MovieSeriaPConfig }
};
