import {Module} from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {PrismaService} from "@root/singles";
import {GroupsBaseModule} from "@modules/groupsBase/groupsBase.module";
import {UsersBaseModule} from "@modules/usersBase/usersBase.module";
import {FilesModule} from "@modules/files/files.module";
import {ProfilesController} from "./profiles/profiles.controller";
import {UsersProfilesService} from "./profiles/profiles.service";


@Module({
    imports: [
        GroupsBaseModule,
        UsersBaseModule,
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
        UsersBaseModule,
        UsersProfilesService
    ]
})
export class UsersModule {
}
