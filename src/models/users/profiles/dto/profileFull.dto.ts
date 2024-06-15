import {ApiProperty} from "@nestjs/swagger";
import {ProfileDto} from "./profile.dto";
import {GroupModelDto} from "@models/groups/dto";


export class ProfileFullDto extends ProfileDto {
    @ApiProperty({ description: 'Архивированные группы пользователя', type: GroupModelDto, isArray: true })
    groupsArchives: GroupModelDto[];
}
