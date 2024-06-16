import {IsNumber, Max, Min} from "class-validator";

export class CreateRatingDto {
    @IsNumber()
    @Min(0.5)
    @Max(10)
    scope: number;
}
