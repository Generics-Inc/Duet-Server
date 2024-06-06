import {ApiProperty} from "@nestjs/swagger";
import {ProfileMinimalDto} from "@models/users/profiles/dto";
import {GroupMinimalDto} from "@models/groups/dto";
import {GroupArchiveModelDto} from "./groupArchiveModel.dto";


export class GroupArchiveDto extends GroupArchiveModelDto {
    @ApiProperty({ description: 'Пользователь записи', type: ProfileMinimalDto })
    profile: ProfileMinimalDto;

    @ApiProperty({ description: 'Архивированная группа', type: GroupMinimalDto })
    group: GroupMinimalDto;
}
