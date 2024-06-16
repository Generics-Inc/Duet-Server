import {ApiProperty} from "@nestjs/swagger";

export class CreateGroupMovieDto {
    @ApiProperty({ description: 'Ещё к просмотру', type: Number, required: false })
    moreToWatch: number[];

    @ApiProperty({ description: 'Флаг просмотренности', type: Boolean, required: false })
    isWatched?: boolean;
}
