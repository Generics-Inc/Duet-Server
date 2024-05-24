import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {GroupsArchivesBaseController} from "./archivesBase/archivesBase.controller";
import {GroupsBaseService} from "./groupsBase.service";
import {GroupsArchivesBaseService} from "./archivesBase/archivesBase.service";
import {GroupsRequestsBaseService} from "./requestsBase/requestsBase.service";

@Module({
    controllers: [
        GroupsArchivesBaseController
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
