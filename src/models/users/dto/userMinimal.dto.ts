import {ApiProperty} from "@nestjs/swagger";
import {Role} from "@prisma/client";


export class UserMinimalDto {
    @ApiProperty({ description: 'ID', type: Number })
    id: number;

    @ApiProperty({ description: 'Прозвище', type: String })
    username: string;

    @ApiProperty({ description: 'Роль', enum: Role })
    role: Role;

    @ApiProperty({ description: 'Дата создания пользователя', type: Date })
    createdAt: Date;

    @ApiProperty({ description: 'Дата последнего изменения пользователя', type: Date })
    updatedAt: Date;
}
