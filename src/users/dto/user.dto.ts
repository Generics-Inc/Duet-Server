import {ApiProperty} from "@nestjs/swagger";
import {RoleDto} from "./role.dto";

export class UserDto {
    @ApiProperty({ description: 'ID', type: Number })
    id: number;

    @ApiProperty({ description: 'Прозвище', type: String })
    username: string;

    @ApiProperty({ description: 'Пароль (только для SU)', type: String })
    password: string;

    @ApiProperty({ description: 'VK токен доступа', type: String })
    vkToken: string;

    @ApiProperty({ description: 'Роль', enum: RoleDto })
    role: RoleDto;
}
