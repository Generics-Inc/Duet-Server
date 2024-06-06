import {Module} from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {UsersModel} from "@models/users/users.model";
import {GroupsModel} from "@models/groups/groups.model";
import {FilesModule} from "@modules/files/files.module";
import {UsersProfilesController} from "./profiles/profiles.controller";
import {UsersAccountsController} from "./accounts/accounts.controller";
import {UsersProfilesService} from "./profiles/profiles.service";
import {UsersAccountsService} from "./accounts/accounts.service";
import { UsersService } from './users.service';


@Module({
    imports: [
        UsersModel,
        GroupsModel,
        FilesModule,
        HttpModule
    ],
    controllers: [
        UsersProfilesController,
        UsersAccountsController
    ],
    providers: [
        UsersProfilesService,
        UsersAccountsService,
        UsersService
    ],
    exports: [
        UsersModel,
        UsersProfilesService,
        UsersAccountsService,
        UsersService
    ]
})
export class UsersModule {}
