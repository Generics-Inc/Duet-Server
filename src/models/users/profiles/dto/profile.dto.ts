import {ApiProperty} from "@nestjs/swagger";
import {Gender} from "@prisma/client";

export class ProfileDto {
    @ApiProperty({ description: 'ID профиля', type: Number })
    id: number;

    @ApiProperty({ description: 'Прозвище', type: String })
    username: string;

    @ApiProperty({ description: 'Имя', type: String })
    firstName: string;

    @ApiProperty({ description: 'Фамилия', type: String })
    lastName: string;

    @ApiProperty({ description: 'День рождения', type: String })
    birthday: string;

    @ApiProperty({ description: 'ID активной группы', type: Number, required: false, default: 0 })
    groupId?: number;

    @ApiProperty({ description: 'ID VK', type: Number, required: false, default: 284470002 })
    vkId?: number;

    @ApiProperty({ description: 'Гендер', enum: Gender, required: false })
    gender?: Gender;

    @ApiProperty({ description: 'Статус (о себе)', type: String, required: false, default: 'Казак с плеч' })
    status?: string;

    @ApiProperty({ description: 'Ссылка на фото профиля', type: String, required: false })
    photo?: string;

    @ApiProperty({ description: 'Дата создания профиля', type: Date })
    createdAt: Date;

    @ApiProperty({ description: 'Дата последнего изменения профиля', type: Date })
    updatedAt: Date;
}
