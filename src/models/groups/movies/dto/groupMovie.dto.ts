import {GroupMovieModelDto} from "./groupMovieModel.dto";
import {GroupMovieCreateTaskModelDto} from "./groupMovieCreateTaskModel.dto";
import {MovieDto} from "@models/movies/dto";

export class GroupMovieDto extends GroupMovieModelDto {
    taskCreate?: GroupMovieCreateTaskModelDto;
    movie?: MovieDto;
}
