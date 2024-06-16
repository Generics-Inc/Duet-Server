import {ApiProperty} from "@nestjs/swagger";
import {ArrayMinSize, IsDate, IsNumber, IsOptional, Max, Min, ValidateNested} from "class-validator";
import {CreateMovieSeriaDto} from "./createMovieSeria.dto";
import {Type} from "class-transformer";

export class CreateMovieSeasonDto {
    @ApiProperty({ description: 'Номер сезона', type: Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(1000)
    number?: number;

    @ApiProperty({ description: 'Дата релиза', type: Date, required: false })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    releaseDate?: Date;

    @ApiProperty({ description: 'Список серий', type: CreateMovieSeriaDto, isArray: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => CreateMovieSeriaDto)
    series: CreateMovieSeriaDto[];
}
