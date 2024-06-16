import {GroupMovieModelDto} from "./groupMovieModel.dto";
import {GroupMovieCreateTaskModelDto} from "./groupMovieCreateTaskModel.dto";
import {ApiProperty} from "@nestjs/swagger";

export class GroupMovieCreateTaskDto extends GroupMovieCreateTaskModelDto {
    @ApiProperty({ description: 'Запись фильма в группе', type: GroupMovieModelDto })
    groupMovie: GroupMovieModelDto;
}
