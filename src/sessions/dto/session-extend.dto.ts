import {ApiProperty} from "@nestjs/swagger";
import {UserDto} from "../../users/dto";
import {SessionDto} from "./session.dto";

export class SessionExtendDto extends SessionDto {
    @ApiProperty({ description: 'Пользователь сессии', type: UserDto })
    user: UserDto;
}
