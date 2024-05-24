import {Module} from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {PrismaService} from "@root/singles";
import {UsersModel} from "@models/users/users.model";
import {GroupsModel} from "@models/groups/groups.model";
import {FilesModule} from "@modules/files/files.module";
import {ProfilesController} from "./profiles/profiles.controller";
import {UsersProfilesService} from "./profiles/profiles.service";


@Module({
    imports: [
        GroupsModel,
        UsersModel,
        FilesModule,
        HttpModule
    ],
    controllers: [
        ProfilesController
    ],
    providers: [
        UsersProfilesService,
        PrismaService
    ],
    exports: [
        UsersModel,
        UsersProfilesService
    ]
})
export class UsersModule {
}
