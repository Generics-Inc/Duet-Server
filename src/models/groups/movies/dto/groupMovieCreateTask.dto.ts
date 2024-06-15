import {GroupMovieModelDto} from "./groupMovieModel.dto";
import {GroupMovieCreateTaskModelDto} from "./groupMovieCreateTaskModel.dto";

export class GroupMovieCreateTaskDto extends GroupMovieCreateTaskModelDto {
    groupMovie: GroupMovieModelDto;
}
