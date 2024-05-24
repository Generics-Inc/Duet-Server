import {forwardRef, Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {PrismaService} from "../singles";
import {ProfilesController} from "./profiles/profiles.controller";
import {ProfilesService} from "./profiles/profiles.service";
import {GroupsModule} from "../groups/groups.module";
import {HttpModule} from "@nestjs/axios";
import {FilesModule} from "../files/files.module";

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
