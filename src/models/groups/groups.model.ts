import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {GroupsRequestsModelService} from "./requests/requests.service";
import {GroupsArchivesModelService} from "./archives/archives.service";
import {GroupsModelService} from "./groups.service";

@Module({
    providers: [
        GroupsModelService,
        GroupsArchivesModelService,
        GroupsRequestsModelService,
        PrismaService
    ],
    exports: [
        GroupsModelService,
        GroupsArchivesModelService,
        GroupsRequestsModelService
    ]
})
export class GroupsModel {}
