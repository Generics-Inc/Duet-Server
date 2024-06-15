import {Module} from '@nestjs/common';
import {GroupsRequestsModelService} from "./requests/requests.service";
import {GroupsArchivesModelService} from "./archives/archives.service";
import {GroupsModelService} from "./groups.service";
import {GroupsMoviesModelService} from "@models/groups/movies/movies.service";

@Module({
    providers: [
        GroupsModelService,
        GroupsArchivesModelService,
        GroupsRequestsModelService,
        GroupsMoviesModelService,
    ],
    exports: [
        GroupsModelService,
        GroupsArchivesModelService,
        GroupsRequestsModelService,
        GroupsMoviesModelService
    ]
})
export class GroupsModel {}
