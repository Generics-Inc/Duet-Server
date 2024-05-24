import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {GroupsModel} from "@models/groups/groups.model";
import {UsersModel} from "@models/users/users.model";
import {GroupsArchivesController} from "@modules/groups/archives/archives.controller";
import {GroupsRequestsController} from "@modules/groups/requests/requests.controller";
import {GroupsArchivesService} from "@modules/groups/archives/archives.service";
import {GroupsRequestsService} from "@modules/groups/requests/requests.service";
import {GroupsController} from "@modules/groups/groups.controller";
import {GroupsService} from "@modules/groups/groups.service";
import {FilesModule} from "@modules/files/files.module";


@Module({
    imports: [
        GroupsModel,
        UsersModel,
        FilesModule
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
        GroupsModel,
        GroupsService,
        GroupsArchivesService,
        GroupsRequestsService
    ]
})
export class GroupsModule {
}
