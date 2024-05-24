import {ApiProperty} from "@nestjs/swagger";
import {GroupRequestDto} from "./group-request.dto";

export class GroupRequestSecureExtendDto extends GroupRequestDto {
    @ApiProperty({ description: 'Имя профиля подавшего запрос', type: String })
    firstName: string;

    @ApiProperty({ description: 'Фамилия профиля подавшего запрос', type: String })
    lastName: string;

    @ApiProperty({ description: 'Фотография профиля подавшего запрос', type: String, required: false })
    photo?: string;
}
