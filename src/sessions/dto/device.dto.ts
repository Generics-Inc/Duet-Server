import {IsNotEmpty, IsString} from "class-validator";

export class DeviceDto {
    @IsString()
    @IsNotEmpty()
    uuid: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    os: string;
}
