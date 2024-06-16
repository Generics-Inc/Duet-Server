import {definePConfig} from "@root/helpers";
import {MovieRatingPConfig} from "./movieRating.config";
import {MovieSeasonPConfig} from "./movieSeason.config";
import {MovieModelPConfig} from "./movieModel.config";


export const MoviePConfig = definePConfig('Movie', {
    ...MovieModelPConfig,
    ratings: { select: MovieRatingPConfig },
    seasons: { select: MovieSeasonPConfig }
});
