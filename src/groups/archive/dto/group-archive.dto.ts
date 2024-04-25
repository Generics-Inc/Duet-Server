import {ApiProperty} from "@nestjs/swagger";

export class GroupArchiveDto {
    @ApiProperty({ description: '', type: Number })
    id: number;

    @ApiProperty({ description: '', type: Number })
    groupId: number;

    @ApiProperty({ description: '', type: Number })
    profileId: number;
}
