import {definePConfig} from "@root/helpers";
import {MovieSeriaPConfig} from "./movieSeria.config";


export const MovieSeasonPConfig = definePConfig('MovieSeason', {
    id: true,
    movieId: true,
    number: true,
    releaseDate: true,
    series: { select: MovieSeriaPConfig }
});
