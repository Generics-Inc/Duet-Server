import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {FilesModule} from "@modules/files/files.module";
import {UsersBaseModule} from "@modules/usersBase/usersBase.module";
import {GroupsBaseModule} from "@modules/groupsBase/groupsBase.module";
import {GroupsController} from "@modules/groups/groups.controller";
import {GroupsService} from "@modules/groups/groups.service";
import {GroupsArchivesController} from "@modules/groups/archives/archives.controller";
import {GroupsArchivesService} from "@modules/groups/archives/archives.service";
import {GroupsRequestsController} from "@modules/groups/requests/requests.controller";
import {GroupsRequestsService} from "@modules/groups/requests/requests.service";


@Module({
    imports: [
        GroupsBaseModule,
        UsersBaseModule,
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
        GroupsBaseModule,
        GroupsService,
        GroupsArchivesService,
        GroupsRequestsService
    ]
})
export class GroupsModule {
}
