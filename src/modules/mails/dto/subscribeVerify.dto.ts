import {IsNotEmpty, IsNumber, IsString, Max, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SubscribeVerifyDto {
    @ApiProperty({ description: 'Почта', type: String })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ description: 'Код подтверждения', type: Number })
    @IsNumber()
    @Min(100000000)
    @Max(999999999)
    code: number;
}
