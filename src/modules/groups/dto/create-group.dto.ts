import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsNotEmpty, IsOptional, IsString, Length} from "class-validator";
import {Type} from "class-transformer";

export class CreateGroupDto {
    @ApiProperty({ description: 'Наименование', type: String })
    @IsString()
    @IsNotEmpty()
    @Length(3, 40)
    name: string;

    @ApiProperty({ description: 'Дата начала отношений', type: Date })
    @IsDate()
    @Type(() => Date)
    relationStartedAt: Date;

    @ApiProperty({ description: 'Описание', type: String, required: false })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Файл изображения', type: Buffer, required: false })
    file?: Buffer;
}
