import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateGroupDto {
    @ApiProperty({ description: 'Название группы', type: String })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Файл изображения', type: Buffer })
    photo: Buffer;
}
