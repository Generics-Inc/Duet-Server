import {ApiProperty} from "@nestjs/swagger";

export class GroupMovieModelDto {
    @ApiProperty({ description: 'ID записи', type: Number })
    id: number;

    @ApiProperty({ description: 'ID группы создателей', type: Number })
    groupId: number;

    @ApiProperty({ description: 'Флаг просмотренности', type: Boolean })
    isWatched: boolean;

    @ApiProperty({ description: 'Информация о том, сколько ещё смотреть', type: Number, isArray: true, default: [0, 0] })
    moreToWatch: number[];

    @ApiProperty({ description: 'Дата создания', type: Date })
    createdAt: Date;

    @ApiProperty({ description: 'Дата обновления', type: Date })
    updatedAt: Date


    @ApiProperty({ description: 'ID создателя записи', type: Number, required: false })
    creatorId?: number;

    @ApiProperty({ description: 'ID подключенного фильма', type: Number, required: false })
    movieId?: number;
}
