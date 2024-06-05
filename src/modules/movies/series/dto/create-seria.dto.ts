import {ApiProperty} from "@nestjs/swagger";
import {IsString, Length} from "class-validator";

export class CreateSeriaDto {
    @ApiProperty({ description: 'Наименование', type: String, required: false, minLength: 3, maxLength: 50 })
    @IsString()
    @Length(3, 50)
    name?: string;
}
