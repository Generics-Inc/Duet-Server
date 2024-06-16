import {ApiProperty} from "@nestjs/swagger";

export class CreateMovieRatingDto {
    @ApiProperty({ description: 'Имя провайдера', type: String })
    providerName: string;

    @ApiProperty({ description: 'Количество голосов', type: Number })
    countOfScopes: number;

    @ApiProperty({ description: 'Средняя оценка', type: Number })
    scope: number;
}
