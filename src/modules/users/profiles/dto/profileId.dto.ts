import {ProfileDto, ProfileMinimalDto} from "@models/users/profiles/dto";
import {GroupStatusDto} from "@modules/users/profiles/dto";
import {ApiProperty} from "@nestjs/swagger";
import {AccountModelDto} from "@models/users/accounts/dto";

export class ProfileIdDto extends ProfileDto {
    @ApiProperty({ description: 'Информация об партнёре', type: ProfileMinimalDto })
    partner: ProfileMinimalDto;

    @ApiProperty({ description: 'Статус профиля с партнёром', type: GroupStatusDto })
    status: GroupStatusDto;

    @ApiProperty({ description: 'Список подключённых аккаунтов', type: AccountModelDto, isArray: true })
    accounts: AccountModelDto[];
}
