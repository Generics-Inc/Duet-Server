import {ApiProperty} from "@nestjs/swagger";
import {ProfileDto} from "../../users/profiles/dto";
import {GroupDto} from "./group.dto";

export class GroupExtendDto extends GroupDto {
    @ApiProperty({ description: 'Пользователи группы', type: ProfileDto, isArray: true })
    profiles: ProfileDto[];
}
