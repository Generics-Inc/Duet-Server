import {ApiProperty} from "@nestjs/swagger";
import {RoleDto} from "./role.dto";

export class UserDto {
    @ApiProperty({ description: 'ID', type: Number })
    id: number;

    @ApiProperty({ description: 'Прозвище', type: String })
    username: string;

    @ApiProperty({ description: 'Пароль (только для SU)', type: String, required: false })
    password?: string;

    @ApiProperty({ description: 'Роль', enum: RoleDto })
    role: RoleDto;

    @ApiProperty({ description: 'Дата создания пользователя', type: Date })
    createdAt: Date;

    @ApiProperty({ description: 'Дата последнего изменения пользователя', type: Date })
    updatedAt: Date;
}
