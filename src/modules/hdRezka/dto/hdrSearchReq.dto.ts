import {HdrSearchValueDto} from "./hdrSearchValue.dto";
import {HdrReqStatusInterface} from "../interfaces";
import {ApiProperty} from "@nestjs/swagger";


export class HdrSearchReq {
    @ApiProperty({ description: 'Статус выполнения запроса', enum: HdrReqStatusInterface })
    status: HdrReqStatusInterface;

    @ApiProperty({ description: 'Список найденных фильмов', type: HdrSearchValueDto, isArray: true })
    values: HdrSearchValueDto[];
}
