import {MovieType} from "@prisma/client";
import {CreateMovieSeasonDto} from "./createMovieSeason.dto";
import {
    IsArray,
    IsDate,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Max,
    Min,
    ValidateNested
} from "class-validator";
import {Type} from "class-transformer";


export class CreateMovieModelDto {
    @IsString()
    @Length(0, 100)
    name: string;

    @IsEnum(MovieType)
    type: MovieType;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    ageRating?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5000)
    time?: number;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    country?: string;

    @IsOptional()
    @IsString()
    @Length(0, 100)
    originalName?: string;

    @IsOptional()
    @IsString()
    @Length(0, 1000)
    slogan?: string;

    @IsOptional()
    @IsString()
    @Length(0, 5000)
    description?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    releaseDate?: Date;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    genres?: string[];

    @ValidateNested({ each: true })
    @Type(() => CreateMovieSeasonDto)
    seasons?: CreateMovieSeasonDto[];

    photo?: string;
    link?: string;
}
