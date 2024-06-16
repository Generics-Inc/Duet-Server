import {MovieType} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class CreateMoviePartDto {
    @ApiProperty({ description: 'Год релиза', type: Number })
    releaseYear: number;

    @ApiProperty({ description: 'Название', type: String })
    name: string;

    @ApiProperty({ description: 'Ссылка на фильм', type: String })
    link: string;

    @ApiProperty({ description: 'Тип', enum: MovieType })
    type: MovieType;

    @ApiProperty({ description: 'Рейтинг', type: Number, required: false })
    rating?: number;
}
