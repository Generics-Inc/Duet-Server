import {ApiProperty} from "@nestjs/swagger";
import {ProfileDto} from "./profile.dto";
import {GroupArchiveModelDto} from "@models/groups/archives/dto";


export class ProfileFullDto extends ProfileDto {
    @ApiProperty({ description: 'Архивированные группы пользователя', type: GroupArchiveModelDto, isArray: true })
    groupsArchives: GroupArchiveModelDto[];
}
