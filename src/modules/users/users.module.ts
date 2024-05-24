import {forwardRef, Module} from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {PrismaService} from "@root//singles";
import {GroupsModule} from "@modules/groups/groups.module";
import {FilesModule} from "@modules/files/files.module";
import {UsersController} from "./users.controller";
import {ProfilesController} from "./profiles/profiles.controller";
import {ProfilesService} from "./profiles/profiles.service";
import {UsersService} from "./users.service";

@Module({
    imports: [
        forwardRef(() => GroupsModule),
        forwardRef(() => FilesModule),
        HttpModule
    ],
    controllers: [
        UsersController,
        ProfilesController
    ],
    providers: [
        UsersService,
        ProfilesService,
        PrismaService
    ],
    exports: [
        UsersService,
        ProfilesService
    ]
})
export class UsersModule {
}
