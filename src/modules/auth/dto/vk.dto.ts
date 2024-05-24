import {IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {DeviceDto} from "@models/sessions/dto";

export class VKDataDto {
    @ApiProperty({ description: 'Токен доступа', type: String })
    @IsNotEmpty()
    @IsString()
    token: string;

    @ApiProperty({ description: 'Уникальный ID авторизации', type: String, required: false })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    uuid?: string;
}

export class VkSignInDto {
    @ApiProperty({ description: 'Данные вк авторизации', type: VKDataDto })
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => VKDataDto)
    vk: VKDataDto;

    @ApiProperty({ description: 'Данные об устройстве', type: DeviceDto })
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => DeviceDto)
    device: DeviceDto;
}
