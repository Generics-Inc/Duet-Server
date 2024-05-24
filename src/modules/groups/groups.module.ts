import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {FilesModule} from "@modules/files/files.module";
import {UsersBaseModule} from "@modules/usersBase/usersBase.module";
import {GroupsBaseModule} from "@modules/groupsBase/groupsBase.module";
import {GroupsController} from "@modules/groups/groups.controller";
import {GroupsService} from "@modules/groups/groups.service";
import {GroupsArchivesController} from "@modules/groups/archives/archives.controller";
import {GroupsArchivesService} from "@modules/groups/archives/archives.service";


@Module({
    imports: [
        GroupsBaseModule,
        UsersBaseModule,
        FilesModule
    ],
    controllers: [
        GroupsController,
        GroupsArchivesController
    ],
    providers: [
        GroupsService,
        GroupsArchivesService,
        PrismaService
    ]
})
export class GroupsModule {
}
