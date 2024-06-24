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
import {ApiProperty} from "@nestjs/swagger";


export class CreateMovieModelDto {
    @ApiProperty({ description: 'Название', type: String, minLength: 1, maxLength: 500 })
    @IsString()
    @Length(1, 500)
    name: string;

    @ApiProperty({ description: 'Тип', enum: MovieType })
    @IsEnum(MovieType)
    type: MovieType;

    @ApiProperty({ description: 'Возрастной рейтинг', type: Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    ageRating?: number;

    @ApiProperty({ description: 'Время материала или части', type: Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5000)
    time?: number;

    @ApiProperty({ description: 'Страна производитель', type: String, required: false, minLength: 1, maxLength: 50 })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    country?: string;

    @ApiProperty({ description: 'Оригинальное название', type: String, required: false, minLength: 1, maxLength: 500 })
    @IsOptional()
    @IsString()
    @Length(1, 500)
    originalName?: string;

    @ApiProperty({ description: 'Слоган', type: String, required: false, minLength: 1, maxLength: 1000 })
    @IsOptional()
    @IsString()
    @Length(1, 1000)
    slogan?: string;

    @ApiProperty({ description: 'Описание', type: String, required: false, minLength: 1, maxLength: 5000 })
    @IsOptional()
    @IsString()
    @Length(1, 5000)
    description?: string;

    @ApiProperty({ description: 'Дата релиза', type: Date, required: false })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    releaseDate?: Date;

    @ApiProperty({ description: 'Список жанров', type: String, isArray: true, required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    genres?: string[];

    @ApiProperty({ description: 'Сезоны', type: CreateMovieSeasonDto, isArray: true, required: false })
    @ValidateNested({ each: true })
    @Type(() => CreateMovieSeasonDto)
    seasons?: CreateMovieSeasonDto[];

    photo?: string;
    link?: string;
}
