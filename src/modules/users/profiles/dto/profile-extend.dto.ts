import {ApiProperty} from "@nestjs/swagger";
import {UserDto} from "../../dto";
import {ProfileDto} from "./profile.dto";
import {GroupRequestDto} from "@modules/groups/requests/dto";
import {GroupArchiveDto} from "@modules/groups/archives/dto";
import {GroupDto} from "@modules/groups/dto";

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
