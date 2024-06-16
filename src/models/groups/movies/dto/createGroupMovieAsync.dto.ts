import {ApiProperty} from "@nestjs/swagger";
import {ExposeAll} from "@root/decorators";
import {MovieType} from "@prisma/client";

@ExposeAll()
export class CreateGroupMovieAsyncDto {
    @ApiProperty({ description: 'Ссылка на контент', type: String })
    link: string;

    @ApiProperty({ description: 'Название', type: String })
    name: string;

    @ApiProperty({ description: 'Дополнительное называние', type: String })
    addName: string;

    @ApiProperty({ description: 'Тип', enum: MovieType })
    type: MovieType;
}
