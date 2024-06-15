import {ApiProperty} from "@nestjs/swagger";
import {GroupArchiveDto} from "@models/groups/archives/dto";
import {ProfileMinimalWithStatusDto} from "@modules/groups/archives/dto/profileMinimalWithStatus.dto";


export class GroupArchiveWithPartnerStatusDto extends GroupArchiveDto {
    @ApiProperty({ description: 'Партнёр пользователя в группе', type: ProfileMinimalWithStatusDto, required: false })
    partner?: ProfileMinimalWithStatusDto;
}
