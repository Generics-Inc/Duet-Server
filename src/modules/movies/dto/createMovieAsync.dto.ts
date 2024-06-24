import {IsEnum, IsString, Length} from "class-validator";
import {MovieType} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";


export class CreateMovieAsyncDto {
    @ApiProperty({ description: 'Ссылка', type: String, minLength: 1, maxLength: 200 })
    @IsString()
    @Length(1, 200)
    link: string;

    @ApiProperty({ description: 'Название', type: String, minLength: 1, maxLength: 500 })
    @IsString()
    @Length(1, 500)
    name: string;

    @ApiProperty({ description: 'Дополнительное имя', type: String, minLength: 1, maxLength: 500 })
    @IsString()
    @Length(1, 500)
    addName: string;

    @ApiProperty({ description: 'Тип', enum: MovieType })
    @IsEnum(MovieType)
    type: MovieType;
}
