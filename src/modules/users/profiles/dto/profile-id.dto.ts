import {ProfileDto} from "@models/users/profiles/dto";
import {GroupStatusDto} from "@modules/users/profiles/dto/group-status.dto";
import {GroupDto} from "@models/groups/dto";
import {ApiProperty} from "@nestjs/swagger";

export class ProfileIdDto extends ProfileDto {
    @ApiProperty({ description: 'Информация об активной группе', type: GroupDto })
    group: GroupDto;

    @ApiProperty({ description: 'Информация об партнёре', type: ProfileDto })
    partner: ProfileDto;

    @ApiProperty({ description: 'Статус профиля с партнёром', type: GroupStatusDto })
    groupStatus: GroupStatusDto;
}
