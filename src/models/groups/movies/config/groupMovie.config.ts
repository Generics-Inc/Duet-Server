import {definePConfig} from "@root/helpers";
import {MoviePConfig} from "@models/movies/config/movie.config";
import {GroupMovieCreateTaskModelPConfig} from "./groupMovieCreateTaskModel.config";
import {GroupMovieWatchedSeriaPConfig} from "./groupMovieWatchedSeria.config";
import {GroupMovieModelPConfig} from "./groupMovieModel.config";


export const GroupMoviePConfig = definePConfig('GroupMovie', {
    ...GroupMovieModelPConfig,
    watchedSeries: { select: GroupMovieWatchedSeriaPConfig },
    taskCreate: { select: GroupMovieCreateTaskModelPConfig },
    movie: { select: MoviePConfig }
});
