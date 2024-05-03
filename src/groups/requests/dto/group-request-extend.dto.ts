import {ApiProperty} from "@nestjs/swagger";
import {GroupRequestDto} from "./group-request.dto";
import {ProfileDto} from "../../../users/profiles/dto";
import {GroupDto} from "../../dto";

export class GroupRequestExtendDto extends GroupRequestDto {
    @ApiProperty({ description: 'Профиль подавший запрос', type: ProfileDto })
    profile: ProfileDto;

    @ApiProperty({ description: 'Группа куда подали запрос', type: GroupDto })
    group: GroupDto;
}
