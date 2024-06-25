import {ApiProperty} from "@nestjs/swagger";

export class StatusSubscribeDto {
    @ApiProperty({ description: 'Статус', type: String })
    status: 'success' | 'error';
}
