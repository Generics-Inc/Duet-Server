import {ApiProperty} from "@nestjs/swagger";
import {MoviePartModelDto} from "./moviePartModel.dto";

export class MoviePartsListDto {
    @ApiProperty({ description: 'ID записи', type: Number })
    id: number;

    @ApiProperty({ description: 'Список частей', type: MoviePartModelDto, isArray: true })
    parts: MoviePartModelDto[];
}
