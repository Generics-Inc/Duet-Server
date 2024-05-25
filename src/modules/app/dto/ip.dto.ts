import {ApiProperty} from "@nestjs/swagger";

export class IpDto {
    @ApiProperty({ description: 'Ответ сервера', type: String, default: '0.0.0.0' })
    ip: string;
}
