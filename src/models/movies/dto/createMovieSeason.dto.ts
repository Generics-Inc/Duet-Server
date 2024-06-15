import {CreateMovieSeriaDto} from "./createMovieSeria.dto";
import {IsDate, IsNumber, IsOptional, Max, Min, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class CreateMovieSeasonDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(1000)
    number?: number;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    releaseDate?: Date;

    @ValidateNested({ each: true })
    @Type(() => CreateMovieSeriaDto)
    series: CreateMovieSeriaDto[];
}
