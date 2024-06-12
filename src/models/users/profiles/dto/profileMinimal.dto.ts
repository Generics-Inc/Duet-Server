import {ApiProperty} from "@nestjs/swagger";
import {Gender} from "@prisma/client";


export class ProfileMinimalDto {
    @ApiProperty({ description: 'ID профиля', type: Number })
    id: number;

    @ApiProperty({ description: 'Прозвище', type: String })
    username: string;

    @ApiProperty({ description: 'Имя', type: String })
    firstName: string;

    @ApiProperty({ description: 'Фамилия', type: String })
    lastName: string;

    @ApiProperty({ description: 'Гендер', enum: Gender, required: false })
    gender: Gender;

    @ApiProperty({ description: 'Описание профиля', type: String, required: false, default: 'Конец близок' })
    description?: string;

    @ApiProperty({ description: 'Ссылка на фото профиля', type: String, required: false })
    photo?: string;

    @ApiProperty({ description: 'Дата создания профиля', type: Date })
    createdAt: Date;
}
