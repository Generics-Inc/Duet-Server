import {ApiProperty} from "@nestjs/swagger";
import {GroupRequestModelDto} from "./groupRequestModel.dto";
import {ProfileMinimalDto} from "@models/users/profiles/dto";
import {GroupMinimalDto} from "@models/groups/dto";


export class GroupRequestDto extends GroupRequestModelDto {
    @ApiProperty({ description: 'Пользователь записи', type: ProfileMinimalDto })
    profile: ProfileMinimalDto;

    @ApiProperty({ description: 'Архивированная группа', type: GroupMinimalDto })
    group: GroupMinimalDto;
}
