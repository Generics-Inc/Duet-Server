import {GroupMovieModelDto} from "./groupMovieModel.dto";
import {GroupMovieCreateTaskModelDto} from "./groupMovieCreateTaskModel.dto";
import {MovieMinimalDto} from "@models/movies/dto/movieMinimal.dto";
import {ProfileMinimalDto} from "@models/users/profiles/dto";

export class GroupMovieMinimalDto extends GroupMovieModelDto {
    taskCreate?: GroupMovieCreateTaskModelDto;
    movie?: MovieMinimalDto;
    creator?: ProfileMinimalDto;
}
