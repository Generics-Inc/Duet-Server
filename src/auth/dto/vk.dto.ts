import {IsNotEmpty, IsObject, IsString, ValidateNested} from "class-validator";
import {DeviceDto} from "../../sessions/dto/device.dto";
import {Type} from "class-transformer";

export class VKDataDto {
    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    @IsString()
    uuid: string;
}

export class VkSignInDto {
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => VKDataDto)
    vk: VKDataDto;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => DeviceDto)
    device: DeviceDto;
}
