import {ApiProperty} from "@nestjs/swagger";
import {GroupMinimalDto} from "./groupMinimal.dto";


export class GroupModelDto extends GroupMinimalDto {
    @ApiProperty({ description: 'Главный пользователь', type: Number, required: false })
    mainProfileId?: number;

    @ApiProperty({ description: 'Приглашенный пользователь', type: Number, required: false })
    secondProfileId?: number;

    @ApiProperty({ description: 'Код приглашения', type: String, required: false })
    inviteCode?: string;

    @ApiProperty({ description: 'Дата начала отношений', type: Date })
    relationStartedAt: Date;

    @ApiProperty({ description: 'Дата последней активности группы', type: Date })
    updatedAt: Date;
}
