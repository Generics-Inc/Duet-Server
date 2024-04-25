import {ApiProperty} from "@nestjs/swagger";

export class SecretDto {
    @ApiProperty({ description: 'Ответ сервера', type: String, default: 'SECRET' })
    message: string;
}
