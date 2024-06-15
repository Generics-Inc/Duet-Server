import { Prisma } from "@prisma/client";
import {MoviePConfig} from "@models/movies/config/movie.config";
import {GroupMovieModelPConfig} from "./groupMovieModel.config";
import {GroupMovieCreateTaskModelPConfig} from "./groupMovieCreateTaskModel.config";


export const GroupMoviePConfig: Prisma.GroupMovieSelect = {
    ...GroupMovieModelPConfig,
    taskCreate: { select: GroupMovieCreateTaskModelPConfig },
    movie: { select: MoviePConfig }
}
