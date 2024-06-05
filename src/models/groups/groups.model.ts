import {Module} from '@nestjs/common';
import {GroupsRequestsModelService} from "./requests/requests.service";
import {GroupsArchivesModelService} from "./archives/archives.service";
import {GroupsModelService} from "./groups.service";

@Module({
    providers: [
        GroupsModelService,
        GroupsArchivesModelService,
        GroupsRequestsModelService
    ],
    exports: [
        GroupsModelService,
        GroupsArchivesModelService,
        GroupsRequestsModelService
    ]
})
export class GroupsModel {}
