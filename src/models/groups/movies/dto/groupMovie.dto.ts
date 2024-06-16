import {MovieDto} from "@models/movies/dto";
import {GroupMovieModelDto} from "./groupMovieModel.dto";
import {GroupMovieCreateTaskModelDto} from "./groupMovieCreateTaskModel.dto";
import {GroupMovieWatchedSeriaDto} from "./groupMovieWatchedSeria.dto";
import {GroupMovieRatingDto} from "./groupMovieRating.dto";

export class GroupMovieDto extends GroupMovieModelDto {
    watchedSeries: GroupMovieWatchedSeriaDto[];
    ratings: GroupMovieRatingDto[];

    movie?: MovieDto;
    taskCreate?: GroupMovieCreateTaskModelDto;
}
