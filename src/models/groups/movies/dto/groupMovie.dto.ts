import {GroupMovieModelDto} from "./groupMovieModel.dto";
import {GroupMovieCreateTaskModelDto} from "./groupMovieCreateTaskModel.dto";
import {GroupMovieWatchedSeriaDto} from "./groupMovieWatchedSeria.dto";
import {MovieDto} from "@models/movies/dto";

export class GroupMovieDto extends GroupMovieModelDto {
    watchedSeries: GroupMovieWatchedSeriaDto[];
    movie?: MovieDto;
    taskCreate?: GroupMovieCreateTaskModelDto;
}
