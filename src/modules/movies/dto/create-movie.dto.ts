import {CreateTagDto} from "@modules/movies/tags/dto";
import {MovieType} from "@prisma/client";
import {CreateSeasonDto} from "@modules/movies/seasons/dto";
import {ApiProperty} from "@nestjs/swagger";
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Max,
    Min,
    ValidateNested
} from "class-validator";
import {Expose, Type} from "class-transformer";
import {ExposeAll} from "@root/decorators";

@ExposeAll()
export class CreateMovieDto {
    @Expose()
    @ApiProperty({ description: 'Название', type: String, minLength: 3, maxLength: 50 })
    @IsString()
    @Length(3, 50)
    name: string;

    @ApiProperty({ description: 'Тип', enum: MovieType })
    @IsEnum(MovieType)
    type: MovieType;

    @ApiProperty({ description: 'Теги', type: CreateTagDto, isArray: true })
    @ValidateNested({ each: true })
    @Type(() => CreateTagDto)
    @IsArray()
    tags: CreateTagDto[];

    @ApiProperty({ description: 'Сезоны', type: CreateSeasonDto, isArray: true })
    @ValidateNested({ each: true })
    @Type(() => CreateSeasonDto)
    @IsArray()
    seasons: CreateSeasonDto[];

    @ApiProperty({ description: 'Статус просмотрено ли', type: Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    isWatched?: boolean;

    @ApiProperty({ description: 'Описание', type: String, required: false, minLength: 0, maxLength: 400 })
    @IsOptional()
    @IsString()
    @Length(0, 500)
    description?: string;

    @ApiProperty({ description: 'Оценённый рейтинг', type: Number, required: false, minimum: 0, maximum: 10 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    rating?: number;

    @ApiProperty({ description: 'Файл изображения', type: Buffer, required: false })
    file?: Buffer;
}
