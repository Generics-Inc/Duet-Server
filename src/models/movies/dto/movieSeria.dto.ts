import {ApiProperty} from "@nestjs/swagger";

export class MovieSeriaDto {
    @ApiProperty({ description: 'ID записи', type: Number })
    id: number;

    @ApiProperty({ description: 'ID сезона', type: Number })
    seasonId: number;

    @ApiProperty({ description: 'Номер серии', type: Number })
    number: number;

    @ApiProperty({ description: 'Название', type: String })
    name: string;

    @ApiProperty({ description: 'Дата релиза', type: Date, required: false })
    releaseDate?: Date;
}
