import {ApiProperty} from "@nestjs/swagger";
import {UserDto} from "../../dto";
import {GroupDto} from "../../../groups/dto";
import {GroupArchiveDto} from "../../../groups/archive/dto";
import {ProfileDto} from "./profile.dto";

export class ProfileExtendDto extends ProfileDto {
    @ApiProperty({ description: 'Пользователь профиля', type: UserDto })
    user: UserDto;

    @ApiProperty({ description: 'Активная группа', type: GroupDto, required: false })
    group?: GroupDto;

    @ApiProperty({ description: 'Группы в корзине', type: GroupArchiveDto, isArray: true })
    groupsArchive: GroupArchiveDto[];
}
