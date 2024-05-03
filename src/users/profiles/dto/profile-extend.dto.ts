import {ApiProperty} from "@nestjs/swagger";
import {UserDto} from "../../dto";
import {GroupDto} from "../../../groups/dto";
import {GroupArchiveDto} from "../../../groups/archives/dto";
import {ProfileDto} from "./profile.dto";
import {GroupRequestDto} from "../../../groups/requests/dto";

export class ProfileExtendDto extends ProfileDto {
    @ApiProperty({ description: 'Группы в корзине', type: GroupArchiveDto, isArray: true })
    groupsArchives: GroupArchiveDto[];

    @ApiProperty({ description: 'Запросы на присоединение к группам', type: GroupRequestDto, isArray: true })
    groupsRequests: GroupRequestDto[];

    @ApiProperty({ description: 'Пользователь профиля', type: UserDto })
    user: UserDto;

    @ApiProperty({ description: 'Активная группа, где пользователь главный', type: GroupDto, required: false })
    mainGroup?: GroupDto;

    @ApiProperty({ description: 'Активная группа, куда пользователя пригласили', type: GroupDto, required: false })
    secondGroup?: GroupDto;
}
