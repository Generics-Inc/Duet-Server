import {GroupMovieModelDto} from "./groupMovieModel.dto";
import {GroupMovieCreateTaskModelDto} from "./groupMovieCreateTaskModel.dto";
import {MovieMinimalDto} from "@models/movies/dto/movieMinimal.dto";
import {ProfileMinimalDto} from "@models/users/profiles/dto";
import {ApiProperty} from "@nestjs/swagger";

export class GroupMovieMinimalDto extends GroupMovieModelDto {
    @ApiProperty({ description: 'Задача на создание фильма', type: GroupMovieCreateTaskModelDto, required: false })
    taskCreate?: GroupMovieCreateTaskModelDto;

    @ApiProperty({ description: 'Подключенный фильм', type: MovieMinimalDto, required: false })
    movie?: MovieMinimalDto;

    @ApiProperty({ description: 'Создатель записи о фильме', type: ProfileMinimalDto, required: false })
    creator?: ProfileMinimalDto;
}
