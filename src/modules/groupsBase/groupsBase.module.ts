import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {GroupsRequestsBaseController} from "./requestsBase/requestsBase.controller";
import {GroupsArchivesBaseController} from "./archivesBase/archivesBase.controller";
import {GroupsBaseController} from "./groupsBase.controller";
import {GroupsBaseService} from "./groupsBase.service";
import {GroupsArchivesBaseService} from "./archivesBase/archivesBase.service";
import {GroupsRequestsBaseService} from "./requestsBase/requestsBase.service";

@Module({
    controllers: [
        GroupsBaseController,
        GroupsArchivesBaseController,
        GroupsRequestsBaseController
    ],
    providers: [
        GroupsBaseService,
        GroupsArchivesBaseService,
        GroupsRequestsBaseService,
        PrismaService
    ],
    exports: [
        GroupsBaseService,
        GroupsArchivesBaseService,
        GroupsRequestsBaseService
    ]
})
export class GroupsBaseModule {}
