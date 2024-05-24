import {forwardRef, Module} from '@nestjs/common';
import {GroupsController} from './groups.controller';
import {GroupsService} from './groups.service';
import {PrismaService} from "../singles";
import {GroupsArchivesService} from "./archives/archives.service";
import {GroupsArchivesController} from "./archives/archives.controller";
import {GroupsRequestsService} from "./requests/requests.service";
import {GroupsRequestsController} from "./requests/requests.controller";
import {UsersModule} from "../users/users.module";
import {FilesModule} from "../files/files.module";

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
