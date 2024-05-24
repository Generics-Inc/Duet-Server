import {ApiProperty} from "@nestjs/swagger";

export class GroupDto {
    @ApiProperty({ description: 'ID', type: Number })
    id: number;

    @ApiProperty({ description: 'Наименование группы', type: String })
    name: string;

    @ApiProperty({ description: 'Описание группы', type: String, required: false })
    description?: string;

    @ApiProperty({ description: 'Главный пользователь', type: Number, required: false })
    mainProfileId?: number;

    @ApiProperty({ description: 'Приглашенный пользователь', type: Number, required: false })
    secondProfileId?: number;

    @ApiProperty({ description: 'Ссылка на обложку', type: String, required: false })
    photo?: string;

    @ApiProperty({ description: 'Код приглашения', type: String, required: false })
    inviteCode?: string;

    @ApiProperty({ description: 'Дата начала отношений', type: Date })
    relationStartedAt: Date;

    @ApiProperty({ description: 'Дата создания группы', type: Date })
    createdAt: Date;

    @ApiProperty({ description: 'Дата последней активности группы', type: Date })
    updatedAt: Date;
}
