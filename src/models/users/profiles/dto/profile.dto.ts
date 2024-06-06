import {ApiProperty} from "@nestjs/swagger";
import {GroupModelDto} from "@models/groups/dto/groupModel.dto";
import {ProfileModelDto} from "./profileModel.dto";


export class ProfileDto extends ProfileModelDto {
    @ApiProperty({ description: 'Активная группа', type: GroupModelDto, required: false })
    group?: GroupModelDto;
}
