import {ApiProperty} from "@nestjs/swagger";
import {ProfileModelDto} from "@models/users/profiles/dto";
import {GroupModelDto} from "@models/groups/dto";
import {GroupArchiveModelDto} from "./groupArchiveModel.dto";


export class GroupArchiveFullDto extends GroupArchiveModelDto {
    @ApiProperty({ description: 'Пользователь записи', type: ProfileModelDto })
    profile: ProfileModelDto;

    @ApiProperty({ description: 'Партнёр пользователя в группе', type: ProfileModelDto })
    partner: ProfileModelDto;

    @ApiProperty({ description: 'Архивированная группа', type: GroupModelDto })
    group: GroupModelDto;
}
