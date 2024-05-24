import {ApiProperty} from "@nestjs/swagger";

export class PingDto {
    @ApiProperty({ description: 'Ответ сервера', type: String, default: 'pong' })
    message: string;
}
