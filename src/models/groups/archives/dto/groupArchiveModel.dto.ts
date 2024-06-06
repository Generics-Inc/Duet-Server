import {ApiProperty} from "@nestjs/swagger";


export class GroupArchiveModelDto {
    @ApiProperty({ description: 'Id записи', type: Number })
    id: number;

    @ApiProperty({ description: 'Id архивированной группы', type: Number })
    groupId: number;

    @ApiProperty({ description: 'Id профиля записи', type: Number })
    profileId: number;

    @ApiProperty({ description: 'Дата внесения группы в архив', type: Date })
    createdAt: Date;
}
