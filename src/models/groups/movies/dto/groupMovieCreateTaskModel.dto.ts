import {MovieType} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class GroupMovieCreateTaskModelDto {
    @ApiProperty({ description: 'ID задачи', type: Number })
    id: number;

    @ApiProperty({ description: 'ID записи фильма в группе', type: Number })
    groupMovieId: number;

    @ApiProperty({ description: 'Ссылка на ресурс', type: String })
    link: string;

    @ApiProperty({ description: 'Название', type: String })
    name: string;

    @ApiProperty({ description: 'Дополнительное название', type: String })
    addName: string;

    @ApiProperty({ description: 'Тип', enum: MovieType })
    type: MovieType;

    @ApiProperty({ description: 'Флаг ошибки', type: Boolean })
    isError: boolean;

    @ApiProperty({ description: 'Дата создания', type: Date })
    createdAt: Date;

    @ApiProperty({ description: 'Дата обновления', type: Date })
    updatedAt: Date;
}
