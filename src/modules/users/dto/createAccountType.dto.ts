import {AccountType} from "@prisma/client";


export class CreateAccountTypeDto {
    UUID: string;
    type: AccountType;
}
