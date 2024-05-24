import {ApiProperty} from "@nestjs/swagger";
import {GroupRequestDto} from "./group-request.dto";
import {GroupDto} from "../../dto";
import {ProfileDto} from "@models/users/profiles/dto";

export class GroupRequestExtendDto extends GroupRequestDto {
    @ApiProperty({ description: 'Профиль подавший запрос', type: ProfileDto })
    profile: ProfileDto;

    @ApiProperty({ description: 'Группа куда подали запрос', type: GroupDto })
    group: GroupDto;
}
