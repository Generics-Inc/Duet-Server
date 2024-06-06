import {Module} from '@nestjs/common';
import {UsersProfilesModelService} from "./profiles/profiles.service";
import {UsersAccountsModelService} from "./accounts/accounts.service";
import {UsersModelService} from "./users.service";


@Module({
    providers: [
        UsersModelService,
        UsersProfilesModelService,
        UsersAccountsModelService
    ],
    exports: [
        UsersModelService,
        UsersProfilesModelService,
        UsersAccountsModelService
    ]
})
export class UsersModel{
}
