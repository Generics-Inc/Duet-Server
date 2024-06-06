import {ApiProperty} from "@nestjs/swagger";


export class GroupMinimalDto {
    @ApiProperty({ description: 'ID', type: Number })
    id: number;

    @ApiProperty({ description: 'Наименование группы', type: String })
    name: string;

    @ApiProperty({ description: 'Описание группы', type: String, required: false })
    description?: string;

    @ApiProperty({ description: 'Ссылка на обложку', type: String, required: false })
    photo?: string;

    @ApiProperty({ description: 'Дата создания группы', type: Date })
    createdAt: Date;
}
