import {IsDate, IsNumber, IsOptional, IsString, Length, Max, Min} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class CreateMovieSeriaDto {
    @ApiProperty({ description: 'Номер серии', type: Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(1000)
    number?: number;

    @ApiProperty({ description: 'Название серии', type: String, required: false })
    @IsString()
    @Length(0, 100)
    name?: string;

    @ApiProperty({ description: 'Дата релиза', type: Date, required: false })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    releaseDate?: Date;
}
