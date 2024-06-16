import {ProfileMinimalDto} from "@models/users/profiles/dto";
import {ArchivePartnerStatus} from "@modules/groups/archives/interfaces";
import {ApiProperty} from "@nestjs/swagger";

export class ProfileMinimalWithStatusDto extends ProfileMinimalDto {
    @ApiProperty({ description: 'Статус партнёра к группе', enum: ArchivePartnerStatus })
    status: ArchivePartnerStatus;
}
