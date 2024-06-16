import {
    IsEnum,
    IsString,
    Length
} from "class-validator";
import {MovieType} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class CreateMovieAsyncDto {
    @ApiProperty({ description: 'Флаг просмотренности', type: String, minLength: 1, maxLength: 200 })
    @IsString()
    @Length(1, 200)
    link: string;

    @ApiProperty({ description: 'Флаг просмотренности', type: String, minLength: 1, maxLength: 100 })
    @IsString()
    @Length(1, 100)
    name: string;

    @ApiProperty({ description: 'Флаг просмотренности', type: String, minLength: 1, maxLength: 100 })
    @IsString()
    @Length(1, 100)
    addName: string;

    @ApiProperty({ description: 'Флаг просмотренности', enum: MovieType })
    @IsEnum(MovieType)
    type: MovieType;
}
