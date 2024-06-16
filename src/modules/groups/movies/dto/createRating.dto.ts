import {IsNumber, Max, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateRatingDto {
    @ApiProperty({ description: 'Оценка фильма', type: Number, minimum: 0.5, maximum: 10 })
    @IsNumber()
    @Min(0.5)
    @Max(10)
    scope: number;
}
