import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class DeviceDto {
    @ApiProperty({ description: 'Уникальный id устройства, который не изменяется в рамках всей системы', type: String })
    @IsString()
    @IsNotEmpty()
    uuid: string;

    @ApiProperty({ description: 'Модель устройства', type: String })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Название операционной системы и версии', type: String })
    @IsString()
    @IsNotEmpty()
    os: string;
}
