import {definePConfig} from "@root/helpers";
import {MovieRatingPConfig} from "./movieRating.config";
import {MovieSeasonPConfig} from "./movieSeason.config";
import {MovieModelPConfig} from "./movieModel.config";
import {MoviePartsListPConfig} from "./moviePartsList.config";


export const MoviePConfig = definePConfig('Movie', {
    ...MovieModelPConfig,
    ratings: { select: MovieRatingPConfig },
    seasons: { select: MovieSeasonPConfig },
    partsList: { select: MoviePartsListPConfig }
});
