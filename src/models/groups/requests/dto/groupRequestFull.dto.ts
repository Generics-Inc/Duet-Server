import {ApiProperty} from "@nestjs/swagger";
import {GroupRequestDto} from "./groupRequest.dto";
import {ProfileModelDto} from "@models/users/profiles/dto";
import {GroupModelDto} from "@models/groups/dto";


export class GroupRequestFullDto extends GroupRequestDto {
    @ApiProperty({ description: 'Пользователь записи', type: ProfileModelDto })
    profile: ProfileModelDto;

    @ApiProperty({ description: 'Архивированная группа', type: GroupModelDto })
    group: GroupModelDto;
}
