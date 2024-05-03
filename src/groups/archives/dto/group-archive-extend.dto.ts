import {ApiProperty} from "@nestjs/swagger";
import {GroupArchiveDto} from "./group-archive.dto";
import {GroupDto} from "../../dto";
import {ProfileDto} from "../../../users/profiles/dto";

export class GroupArchiveExtendDto extends GroupArchiveDto {
    @ApiProperty({ description: 'Архивированная группа', type: GroupDto })
    group: GroupDto;

    @ApiProperty({ description: 'Пользователь записи', type: GroupDto })
    profile: ProfileDto;
}
