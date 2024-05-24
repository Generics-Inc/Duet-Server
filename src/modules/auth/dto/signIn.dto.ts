import {IsNotEmpty, IsObject, IsString, MinLength, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {DeviceDto} from "@modules/sessionsBase/dto";

export class UserLoginDto {
    @ApiProperty({ description: 'Имя пользователя', type: String })
    @IsString()
    @MinLength(5)
    username: string;

    @ApiProperty({ description: 'Пароль (может быть только у SU)', type: String })
    @IsString()
    @MinLength(5)
    password: string;
}

export class SignInDto {
    @ApiProperty({ description: 'Данные авторизации', type: UserLoginDto })
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => UserLoginDto)
    user: UserLoginDto;

    @ApiProperty({ description: 'Данные об устройстве', type: DeviceDto })
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => DeviceDto)
    device: DeviceDto;
}
