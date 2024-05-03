import {Module} from '@nestjs/common';
import {GroupsController} from './groups.controller';
import {GroupsService} from './groups.service';
import {PrismaService} from "../prisma.service";
import {UsersModule} from "../users/users.module";
import {GroupsArchivesService} from "./archives/archives.service";
import {GroupsArchivesController} from "./archives/archives.controller";
import {FilesService} from "../files/files.service";
import {GroupsRequestsService} from "./requests/requests.service";
import {GroupsRequestsController} from "./requests/requests.controller";

@Module({
    imports: [
        UsersModule
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
        PrismaService,
        FilesService
    ],
    exports: [
        GroupsService
    ]
})
export class GroupsModule {}
