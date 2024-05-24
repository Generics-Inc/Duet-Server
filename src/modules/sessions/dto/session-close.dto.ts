import {IsNumber} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SessionCloseDto {
    @ApiProperty({ description: 'Список ID сессий пользователя для закрытия', type: Number, isArray: true })
    @IsNumber({}, { each: true })
    ids: number[];
}
