import {definePConfig} from "@root/helpers";
import {MovieRatingModelPConfig} from "./movieRatingModel.config";
import {MovieSeasonPConfig} from "./movieSeason.config";
import {MovieModelPConfig} from "./movieModel.config";


export const MoviePConfig = definePConfig('Movie', {
    ...MovieModelPConfig,
    ratings: { select: MovieRatingModelPConfig },
    seasons: { select: MovieSeasonPConfig }
});
