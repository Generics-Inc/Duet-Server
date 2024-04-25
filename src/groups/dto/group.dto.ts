import {ApiProperty} from "@nestjs/swagger";

export class GroupDto {
    @ApiProperty({ description: 'ID', type: Number })
    id: number;

    @ApiProperty({ description: 'Группа на удаление', type: Boolean })
    forDeletion: boolean;

    @ApiProperty({ description: 'Код приглашения', type: String })
    inviteCode: string;
}
