import {Module} from '@nestjs/common';
import {GroupsModel} from "@models/groups/groups.model";
import {UsersModel} from "@models/users/users.model";
import {GroupsArchivesController} from "@modules/groups/archives/archives.controller";
import {GroupsRequestsController} from "@modules/groups/requests/requests.controller";
import {GroupsArchivesService} from "@modules/groups/archives/archives.service";
import {GroupsRequestsService} from "@modules/groups/requests/requests.service";
import {GroupsController} from "@modules/groups/groups.controller";
import {GroupsService} from "@modules/groups/groups.service";
import {FilesModule} from "@modules/files/files.module";
import {GroupsMoviesService} from "@modules/groups/movies/movies.service";
import {GroupsMoviesController} from "@modules/groups/movies/movies.controller";
import {TasksModule} from "@modules/tasks/tasks.module";


@Module({
    imports: [
        TasksModule,
        GroupsModel,
        UsersModel,
        FilesModule
    ],
    controllers: [
        GroupsController,
        GroupsArchivesController,
        GroupsRequestsController,
        GroupsMoviesController
    ],
    providers: [
        GroupsService,
        GroupsArchivesService,
        GroupsRequestsService,
        GroupsMoviesService
    ],
    exports: [
        GroupsModel,
        GroupsService,
        GroupsArchivesService,
        GroupsRequestsService,
        GroupsMoviesService
    ]
})
export class GroupsModule {
}
