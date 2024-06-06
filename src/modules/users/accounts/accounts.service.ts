import {Injectable} from '@nestjs/common';
import {UsersAccountsModelService} from "@models/users/accounts/accounts.service";


@Injectable()
export class UsersAccountsService {
    constructor(private modelService: UsersAccountsModelService) {}

    getModel() {
        return this.modelService;
    }
}
