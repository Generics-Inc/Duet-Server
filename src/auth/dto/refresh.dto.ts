import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RefreshDto {
    @ApiProperty({ description: 'Токен доступа', type: String })
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}

