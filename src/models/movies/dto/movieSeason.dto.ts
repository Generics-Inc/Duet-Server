import {ApiProperty} from "@nestjs/swagger";
import {MovieSeriaDto} from "./movieSeria.dto";

export class MovieSeasonDto {
    @ApiProperty({ description: 'ID записи', type: Number })
    id: number;

    @ApiProperty({ description: 'ID фильма', type: Number })
    movieId: number;

    @ApiProperty({ description: 'Номер сезона', type: Number })
    number: number;

    @ApiProperty({ description: 'Дата релиза', type: Date, required: false })
    releaseDate?: Date;

    @ApiProperty({ description: 'Список серий', type: MovieSeriaDto, isArray: true })
    series: MovieSeriaDto[];
}
