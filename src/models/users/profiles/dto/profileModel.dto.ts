import {ApiProperty} from "@nestjs/swagger";
import {ProfileMinimalDto} from "./profileMinimal.dto";


export class ProfileModelDto extends ProfileMinimalDto {
    @ApiProperty({ description: 'День рождения', type: String })
    birthday: string;

    @ApiProperty({ description: 'ID активной группы', type: Number, required: false, default: 0 })
    groupId?: number;

    @ApiProperty({ description: 'ID VK', type: Number, required: false, default: 284470002 })
    vkId?: number;

    @ApiProperty({ description: 'Дата последнего изменения профиля', type: Date })
    updatedAt: Date;
}
