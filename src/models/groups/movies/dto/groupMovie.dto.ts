import {MovieDto} from "@models/movies/dto";
import {GroupMovieModelDto} from "./groupMovieModel.dto";
import {GroupMovieCreateTaskModelDto} from "./groupMovieCreateTaskModel.dto";
import {GroupMovieWatchedSeriaDto} from "./groupMovieWatchedSeria.dto";
import {GroupMovieRatingDto} from "./groupMovieRating.dto";
import {ApiProperty} from "@nestjs/swagger";

export class GroupMovieDto extends GroupMovieModelDto {
    @ApiProperty({ description: 'Список просмотренных серий', type: GroupMovieWatchedSeriaDto, isArray: true })
    watchedSeries: GroupMovieWatchedSeriaDto[];

    @ApiProperty({ description: 'Оценки партнёров', type: GroupMovieRatingDto, isArray: true })
    ratings: GroupMovieRatingDto[];

    @ApiProperty({ description: 'Подключенный фильм', type: MovieDto, required: false })
    movie?: MovieDto;

    @ApiProperty({ description: 'Задача на создание фильма', type: GroupMovieCreateTaskModelDto, required: false })
    taskCreate?: GroupMovieCreateTaskModelDto;
}
