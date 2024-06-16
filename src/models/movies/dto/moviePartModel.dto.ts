import {MovieType} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class MoviePartModelDto {
    @ApiProperty({ description: 'ID Записи', type: String })
    link: string;

    @ApiProperty({ description: 'Дата релиза', type: Number })
    releaseYear: number;

    @ApiProperty({ description: 'Название', type: String })
    name: string;

    @ApiProperty({ description: 'Тип', enum: MovieType })
    type: MovieType;

    @ApiProperty({ description: 'Флаг текущей части', type: Boolean })
    current: boolean;

    @ApiProperty({ description: 'Рейтинг', type: Number, required: false })
    rating?: number;

    @ApiProperty({ description: 'ID списка частей', type: Number, required: false })
    partsListId?: number;

    @ApiProperty({ description: 'ID подключенного фильма', type: Number, required: false })
    movieId?: number;
}
