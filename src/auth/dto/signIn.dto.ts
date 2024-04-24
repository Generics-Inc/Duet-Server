import {IsNotEmpty, IsObject, IsString, MinLength, ValidateNested} from "class-validator";
import {DeviceDto} from "../../sessions/dto/device.dto";
import {Type} from "class-transformer";

export class UserLoginDto {
    @IsString()
    @MinLength(5)
    username: string;

    @IsString()
    @MinLength(5)
    password: string;
}

export class SignInDto {
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => UserLoginDto)
    user: UserLoginDto;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => DeviceDto)
    device: DeviceDto;
}
