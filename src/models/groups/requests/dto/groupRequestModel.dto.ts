import {ApiProperty} from "@nestjs/swagger";


export class GroupRequestModelDto {
    @ApiProperty({ description: 'ID запроса', type: Number })
    id: number;

    @ApiProperty({ description: 'ID Профиля подавшего запрос', type: Number })
    profileId: number;

    @ApiProperty({ description: 'ID Группы куда подали запрос', type: Number })
    groupId: number;

    @ApiProperty({ description: 'Код приглашения использованный при создании запроса', type: String })
    inviteCode: string;

    @ApiProperty({ description: 'Время создания запроса', type: Date })
    createdAt: Date;
}
