import {ApiProperty} from "@nestjs/swagger";
import {ProfileDto} from "@modules/users/profiles/dto";
import {GroupDto} from "../../dto";
import {GroupArchiveDto} from "./group-archive.dto";

export class GroupArchiveExtendDto extends GroupArchiveDto {
    @ApiProperty({ description: 'Пользователь записи', type: ProfileDto })
    profile: ProfileDto;

    @ApiProperty({ description: 'Архивированная группа', type: GroupDto })
    group: GroupDto;
}
