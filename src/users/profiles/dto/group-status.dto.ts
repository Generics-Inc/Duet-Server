import {ApiProperty} from "@nestjs/swagger";

export enum GroupStatusSelf {
    NOT_IN_GROUP = 'NOT_IN_GROUP',
    NOT_IN_GROUP_WITH_ARCHIVE = 'NOT_IN_GROUP_WITH_ARCHIVE',
    IN_GROUP = 'IN_GROUP'
}
export enum GroupStatusPartner {
    NO_PARTNER = 'NO_PARTNER',
    GROUP_IN_ARCHIVE = 'GROUP_IN_ARCHIVE',
    LEAVED = 'LEAVED',
    IN_GROUP = 'IN_GROUP'
}

export class GroupStatusDto {
    @ApiProperty({ description: 'Информация об активном пользователе', enum: GroupStatusSelf })
    self: GroupStatusSelf;

    @ApiProperty({ description: 'Информация об партнёре активной группы', enum: GroupStatusSelf })
    partner: GroupStatusPartner;
}
