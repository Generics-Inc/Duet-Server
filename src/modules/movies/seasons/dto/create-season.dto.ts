import {CreateSeriaDto} from "@modules/movies/series/dto";
import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsString, Length, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class CreateSeasonDto {
    @ApiProperty({ description: 'Наименование', type: String, required: false, minLength: 3, maxLength: 50 })
    @IsString()
    @Length(3, 50)
    name?: string;

    @ApiProperty({ description: 'Серии', type: CreateSeriaDto, isArray: true })
    @ValidateNested({ each: true })
    @Type(() => CreateSeriaDto)
    @IsArray()
    series: CreateSeriaDto[];
}
