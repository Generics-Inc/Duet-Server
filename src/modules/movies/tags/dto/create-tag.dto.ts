import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsOptional, IsString, Length} from "class-validator";
import {ExposeAll} from "@root/decorators";

@ExposeAll()
export class CreateTagDto {
    @ApiProperty({ description: 'Наименование', type: String, minLength: 2, maxLength: 20 })
    @IsString()
    @Length(2, 20)
    name: string;

    @ApiProperty({ description: 'Цвет плашки', type: String, minLength: 6, maxLength: 6 })
    @IsString()
    @Length(6, 6)
    color: string;
}
