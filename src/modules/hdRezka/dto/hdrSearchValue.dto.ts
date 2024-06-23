import {MovieType} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";


export class HdrSearchValueDto {
    @ApiProperty({ description: 'Название', type: String })
    name: string;

    @ApiProperty({ description: 'Дополнительное название', type: String })
    addName: string;

    @ApiProperty({ description: 'Ссылка на контент', type: String })
    url: string;

    @ApiProperty({ description: 'Тип', enum: MovieType })
    type: MovieType;

    @ApiProperty({ description: 'Средняя оценка', type: Number, required: false })
    rating: number | null;
}
