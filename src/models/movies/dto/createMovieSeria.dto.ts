import {IsDate, IsNumber, IsOptional, IsString, Length, Max, Min} from "class-validator";
import {Type} from "class-transformer";

export class CreateMovieSeriaDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(1000)
    number?: number;

    @IsString()
    @Length(0, 100)
    name?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    releaseDate?: Date;
}
