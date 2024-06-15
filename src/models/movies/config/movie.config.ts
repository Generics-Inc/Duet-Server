import { Prisma } from "@prisma/client";
import {MovieRatingModelPConfig} from "./movieRatingModel.config";
import {MovieSeasonPConfig} from "./movieSeason.config";
import {MovieModelPConfig} from "./movieModel.config";

export const MoviePConfig: Prisma.MovieSelect = {
    ...MovieModelPConfig,
    ratings: { select: MovieRatingModelPConfig },
    seasons: { select: MovieSeasonPConfig }
};
