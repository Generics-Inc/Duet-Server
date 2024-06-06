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
    @ApiProperty({ description: 'ID профиля активного пользователя', type: Number })
    selfId: number;

    @ApiProperty({ description: 'ID профиля партнёра активной группы', type: Number, required: false })
    partnerId?: number;

    @ApiProperty({ description: 'Статус активного пользователя', enum: GroupStatusSelf })
    selfStatus: GroupStatusSelf;

    @ApiProperty({ description: 'Статус партнёра активной группы', enum: GroupStatusPartner })
    partnerStatus: GroupStatusPartner;

    @ApiProperty({ description: 'Статус главного в активной группе', type: Boolean })
    isMainInGroup: boolean;
}
