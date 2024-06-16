import {MovieType} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class MovieMinimalDto {
    @ApiProperty({ description: 'ID записи', type: Number })
    id: number;

    @ApiProperty({ description: 'Название', type: String })
    name: string;

    @ApiProperty({ description: 'Тип', enum: MovieType })
    type: MovieType;

    @ApiProperty({ description: 'Ссылка на постер', type: String })
    photo: string;

    @ApiProperty({ description: 'Дата обновления', type: Date })
    updatedAt: Date;

    @ApiProperty({ description: 'Дата создания', type: Date })
    createdAt: Date;


    @ApiProperty({ description: 'ID создателя записи', type: Number, required: false })
    creatorId?: number;

    @ApiProperty({ description: 'Оригинальное название', type: String, required: false })
    originalName?: string;
}
