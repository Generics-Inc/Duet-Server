import {ApiProperty} from "@nestjs/swagger";

export class TokensDto {
    @ApiProperty({ description: 'Токен доступа', type: String })
    accessToken: string;

    @ApiProperty({ description: 'Токен обновления токена доступа', type: String })
    refreshToken: string;
}
