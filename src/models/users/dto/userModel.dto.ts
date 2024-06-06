import {ApiProperty} from "@nestjs/swagger";
import {UserMinimalDto} from "./userMinimal.dto";


export class UserModelDto extends UserMinimalDto {
    @ApiProperty({ description: 'Пароль (только для SU)', type: String, required: false })
    password?: string;
}
