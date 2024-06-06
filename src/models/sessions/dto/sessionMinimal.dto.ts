import {ApiProperty} from "@nestjs/swagger";


export class SessionMinimalDto {
    @ApiProperty({ description: 'ID сессии', type: Number })
    id: number;

    @ApiProperty({ description: 'ID пользователя', type: Number })
    userId: number;

    @ApiProperty({ description: 'IP пользователя', type: String })
    ip: string;

    @ApiProperty({ description: 'Индикатор текущей сессии', type: Boolean, default: false })
    current: boolean;

    @ApiProperty({ description: 'Уникальный ID устройства', type: String })
    deviceUUID: string;

    @ApiProperty({ description: 'Модель устройства', type: String })
    deviceName: string;

    @ApiProperty({ description: 'Операционная система и версия устройства', type: String })
    deviceOS: string;

    @ApiProperty({ description: 'Дата входа в систему', type: Date })
    createdAt: Date;

    @ApiProperty({ description: 'Дата последней активности пользователя', type: Date })
    lastActivityAt: Date;
}
