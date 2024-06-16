import {ApiProperty} from "@nestjs/swagger";

export class GroupMovieRatingModelDto {
    @ApiProperty({ description: 'ID записи', type: Number })
    id: number;

    @ApiProperty({ description: 'ID пользователя оценившего фильм', type: Number })
    profileId: number;

    @ApiProperty({ description: 'ID фильма группы', type: Number })
    groupMovieId: number;

    @ApiProperty({ description: 'Оценка', type: Number, minimum: 0.5, maximum: 10 })
    scope: number;

    @ApiProperty({ description: 'Дата создания', type: Date })
    createdAt: Date;
}
