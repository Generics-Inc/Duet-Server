import {Injectable} from '@nestjs/common';
import {GroupArchiveNotFoundException, GroupNotFoundException} from "@root/errors";
import {PrismaService} from "@root/singles";
import {utils} from "@root/helpers";
import {GroupsArchivesModelService} from "@models/groups/archives/archives.service";
import {GroupsRequestsModelService} from "@models/groups/requests/requests.service";
import {GroupsModelService} from "@models/groups/groups.service";
import {GroupsService} from "@modules/groups/groups.service";

@Injectable()
export class GroupsArchivesService {
    private utils = utils();

    constructor(
        private groupsService: GroupsService,
        private groupsModelService: GroupsModelService,
        private groupsRequestsModelService: GroupsRequestsModelService,
        private groupsArchivesModelService: GroupsArchivesModelService,
        private prismaService: PrismaService
    ) {}

    getBase() {
        return this.groupsArchivesModelService;
    }

    async revertGroupFromArchive(profileId: number, recordId: number) {
        const { group, ...record } = this.utils.ifEmptyGivesError(await this.groupsArchivesModelService.getArchiveRecordByIdAndProfileId(recordId, profileId, true), GroupArchiveNotFoundException);

        const updateGroup = this.groupsModelService.updateGroup(record.groupId, {
            [!group.mainProfileId ? 'mainProfile' : 'secondProfile']: {
                connect: {
                    id: profileId
                }
            }
        });
        const deleteRequests = this.groupsRequestsModelService.deleteRequestsByProfileId(profileId);
        const deleteRecord = this.groupsArchivesModelService.deleteArchiveById(record.id, profileId);

        await this.prismaService.$transaction([updateGroup, deleteRequests, deleteRecord]);

        return this.groupsService.getGroupByProfileId(profileId);
    }

    async deleteArchiveRecordWithChecks(id: number, profileId: number) {
        const archiveRecord = this.utils.ifEmptyGivesError(await this.groupsArchivesModelService.getArchiveRecordByIdAndProfileId(id, profileId), GroupArchiveNotFoundException);
        const group = this.utils.ifEmptyGivesError(await this.groupsModelService.getGroupById(archiveRecord.groupId, true), GroupNotFoundException);
        const isLastUser = group.groupArchives.length === 1 && group.mainProfileId === null;

        if (isLastUser) await this.groupsService.deleteGroupById(profileId, group.id);
        else await this.groupsArchivesModelService.deleteArchiveById(id, profileId);
    }
}
