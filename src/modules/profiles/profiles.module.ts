import {Module} from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {PrismaService} from "@root/singles";
import {FilesModule} from "@modules/files/files.module";
import {ProfilesService} from "@modules/profiles/profiles.service";
import {ProfilesController} from "@modules/profiles/profiles.controller";
import {GroupsBaseModule} from "@modules/groupsBase/groupsBase.module";
import {UsersBaseModule} from "@modules/usersBase/usersBase.module";

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
        ProfilesService,
        PrismaService
    ],
    exports: [
        ProfilesService
    ]
})
export class ProfilesModule {
}
