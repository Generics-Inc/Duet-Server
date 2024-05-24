import {forwardRef, Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {FilesModule} from "@modules/files/files.module";
import {UsersModule} from "@modules/users/users.module";
import {GroupsRequestsController} from "./requests/requests.controller";
import {GroupsArchivesController} from "./archives/archives.controller";
import {GroupsController} from "./groups.controller";
import {GroupsService} from "./groups.service";
import {GroupsArchivesService} from "./archives/archives.service";
import {GroupsRequestsService} from "./requests/requests.service";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(() => FilesModule)
    ],
    controllers: [
        GroupsController,
        GroupsArchivesController,
        GroupsRequestsController
    ],
    providers: [
        GroupsService,
        GroupsArchivesService,
        GroupsRequestsService,
        PrismaService
    ],
    exports: [
        GroupsService,
        GroupsArchivesService,
        GroupsRequestsService
    ]
})
export class GroupsModule {}
