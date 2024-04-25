import {ApiProperty} from "@nestjs/swagger";

export class SessionDto {
    @ApiProperty({ description: 'ID сессии', type: Number })
    id: number;

    @ApiProperty({ description: 'ID пользователя', type: Number })
    userId: number;

    @ApiProperty({ description: 'Уникальный ID устройства', type: String })
    deviceUUID: string;

    @ApiProperty({ description: 'Модель устройства', type: String })
    deviceName: string;

    @ApiProperty({ description: 'Операционная система и версия устройства', type: String })
    deviceOS: string;

    @ApiProperty({ description: 'Хэшированный токен доступа', type: String })
    accessToken: string;

    @ApiProperty({ description: 'Хэшированный токен обновления', type: String })
    refreshToken: string;

    @ApiProperty({ description: 'Дата входа в систему', type: Date })
    loggedAt: Date;

    @ApiProperty({ description: 'Дата последней активности пользователя', type: Date })
    lastActivityAt: Date;
}
