import {ApiProperty} from "@nestjs/swagger";
import {UserMinimalDto} from "@models/users/dto";
import {AccountModelDto} from "./accountModel.dto";


export class AccountDto extends AccountModelDto {
    @ApiProperty({ description: 'Подключенный пользователь', type: UserMinimalDto })
    user: UserMinimalDto;
}
