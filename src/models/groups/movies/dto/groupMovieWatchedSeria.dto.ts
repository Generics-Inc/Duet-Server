import {ApiProperty} from "@nestjs/swagger";

export class GroupMovieWatchedSeriaDto {
    @ApiProperty({ description: 'ID просмотренной серии', type: Number })
    seriaId: number;

    @ApiProperty({ description: 'ID фильма группы', type: Number })
    groupMovieId: number;

    @ApiProperty({ description: 'Дата создания', type: Date })
    createdAt: Date;
}
