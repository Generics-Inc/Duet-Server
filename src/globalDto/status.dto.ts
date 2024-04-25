import {ApiProperty} from "@nestjs/swagger";

export class StatusDto {
    @ApiProperty({ description: 'Статус', type: Boolean })
    status: boolean;
}
