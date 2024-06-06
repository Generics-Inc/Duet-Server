import {ApiProperty} from "@nestjs/swagger";
import {GroupArchiveModelDto} from "@models/groups/archives/dto/groupArchiveModel.dto";
import {GroupRequestModelDto} from "@models/groups/requests/dto/groupRequestModel.dto";
import {ProfileMinimalDto} from "@models/users/profiles/dto/profileMinimal.dto";
import {GroupModelDto} from "./groupModel.dto";


export class GroupDto extends GroupModelDto {
    @ApiProperty({ description: 'Записи группы в корзине', type: GroupArchiveModelDto, isArray: true })
    groupArchives: GroupArchiveModelDto[];

    @ApiProperty({ description: 'Запросы на присоединение к группе', type: GroupRequestModelDto, isArray: true })
    groupRequests: GroupRequestModelDto[];

    @ApiProperty({ description: 'Партнёр-создатель', type: ProfileMinimalDto })
    mainProfile: ProfileMinimalDto;

    @ApiProperty({ description: 'Приглашенный партнёр', type: ProfileMinimalDto })
    secondProfile: ProfileMinimalDto;
}
