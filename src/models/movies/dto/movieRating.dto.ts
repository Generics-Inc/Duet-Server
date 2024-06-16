import {ApiProperty} from "@nestjs/swagger";

export class MovieRatingDto {
    @ApiProperty({ description: 'ID записи', type: Number })
    id: number;

    @ApiProperty({ description: 'ID фильма', type: Number })
    movieId: number;

    @ApiProperty({ description: 'Имя провайдера', type: String })
    providerName: string;

    @ApiProperty({ description: 'Количество голосов', type: Number })
    countOfScopes: number;

    @ApiProperty({ description: 'Средняя оценка', type: Number })
    scope: number;
}
