import {ApiProperty} from "@nestjs/swagger";
import {AccountType} from "@prisma/client";


export class AccountModelDto {
    @ApiProperty({ description: 'Id', type: Number })
    id: number;

    @ApiProperty({ description: 'Id подключенного пользователя', type: Number })
    userId: number;

    @ApiProperty({ description: 'UUID подключенного аккаунта', type: String })
    UUID: string;

    @ApiProperty({ description: 'Провайдер аккаунта', enum: AccountType })
    type: AccountType;
}
