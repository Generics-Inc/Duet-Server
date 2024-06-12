import {ApiProperty} from "@nestjs/swagger";
import {ProfileModelDto} from "./profileModel.dto";
import {GroupMinimalDto} from "@models/groups/dto";


export class ProfileDto extends ProfileModelDto {
    @ApiProperty({ description: 'Активная группа', type: GroupMinimalDto, required: false })
    group?: GroupMinimalDto;
}
