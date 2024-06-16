import {ApiProperty} from "@nestjs/swagger";
import {MovieMinimalDto} from "./movieMinimal.dto";

export class MovieModelDto extends MovieMinimalDto {
    @ApiProperty({ description: 'Список жанров', type: String, isArray: true })
    genres: string[];

    @ApiProperty({ description: 'Флаг проверки модератором', type: Boolean })
    moderated: boolean;

    @ApiProperty({ description: 'Возрастной рейтинг', type: Number, required: false })
    ageRating?: number;

    @ApiProperty({ description: 'ID списка частей', type: Number, required: false })
    partsListId?: number;

    @ApiProperty({ description: 'Время материала или части', type: Number, required: false })
    time?: number;

    @ApiProperty({ description: 'Ссылка на контент', type: String, required: false })
    link?: string;

    @ApiProperty({ description: 'Страна производитель', type: String, required: false })
    country?: string;

    @ApiProperty({ description: 'Слоган', type: String, required: false })
    slogan?: string;

    @ApiProperty({ description: 'Описание', type: String, required: false })
    description?: string;

    @ApiProperty({ description: 'Дата релиза', type: Date, required: false })
    releaseDate?: Date;
}
