import {ApiProperty} from "@nestjs/swagger";
import {SessionMinimalDto} from "./sessionMinimal.dto";


export class SessionModelDto extends SessionMinimalDto {
    @ApiProperty({ description: 'Токен доступа', type: Number })
    accessToken?: string;

    @ApiProperty({ description: 'Токен обновления', type: Number })
    refreshToken?: string;
}

