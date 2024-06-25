import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UnsubscribeDto {
    @ApiProperty({ description: 'Почта', type: String })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ description: 'Код подтверждения', type: Number })
    @IsNumber()
    code: number;
}
