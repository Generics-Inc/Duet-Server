import {
    IsEnum,
    IsString,
    Length
} from "class-validator";
import {ExposeAll} from "@root/decorators";
import {MovieType} from "@prisma/client";

@ExposeAll()
export class CreateMovieAsyncDto {
    @IsString()
    @Length(1, 200)
    link: string;

    @IsString()
    @Length(1, 100)
    name: string;

    @IsString()
    @Length(1, 100)
    addName: string;

    @IsEnum(MovieType)
    type: MovieType;
}
