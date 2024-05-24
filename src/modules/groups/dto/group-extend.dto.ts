import {ApiProperty} from "@nestjs/swagger";
import {ProfileDto} from "@modules/users/profiles/dto";
import {GroupDto} from "./group.dto";
import {GroupArchiveDto} from "../archives/dto";
import {GroupRequestDto} from "../requests/dto";

export class GroupExtendDto extends GroupDto {
    @ApiProperty({ description: 'Записи группы в корзине', type: GroupArchiveDto, isArray: true })
    groupArchives: GroupArchiveDto[];

    @ApiProperty({ description: 'Запросы на присоединение к группе', type: GroupRequestDto, isArray: true })
    groupRequests: GroupRequestDto[];

    @ApiProperty({ description: 'Главный пользователь', type: ProfileDto, required: false })
    mainProfile?: ProfileDto;

    @ApiProperty({ description: 'Приглашенный пользователь', type: ProfileDto, required: false })
    secondProfile?: ProfileDto;
}
