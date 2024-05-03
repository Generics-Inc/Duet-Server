import {Module} from '@nestjs/common';
import {GroupsController} from './groups.controller';
import {GroupsService} from './groups.service';
import {PrismaService} from "../prisma.service";
import {GroupsArchivesService} from "./archives/archives.service";
import {GroupsArchivesController} from "./archives/archives.controller";
import {FilesService} from "../files/files.service";
import {GroupsRequestsService} from "./requests/requests.service";
import {GroupsRequestsController} from "./requests/requests.controller";
import {ProfilesService} from "../users/profiles/profiles.service";

@Module({
    controllers: [
        GroupsController,
        GroupsArchivesController,
        GroupsRequestsController
    ],
    providers: [
        GroupsService,
        GroupsArchivesService,
        GroupsRequestsService,
        ProfilesService,
        PrismaService,
        FilesService
    ],
    exports: [
        GroupsService,
        GroupsArchivesService,
        GroupsRequestsService
    ]
})
export class GroupsModule {}
