import {IsEmail, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SubscribeDto {
    @ApiProperty({ description: 'Почта', type: String })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
