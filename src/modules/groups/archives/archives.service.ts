import {Injectable} from '@nestjs/common';
import {GroupArchiveNotFoundException, GroupNotFoundException} from "@root/errors";
import {PrismaService} from "@root/singles";
import {utils} from "@root/helpers";
import {GroupsRequestsBaseService} from "@modules/groupsBase/requestsBase/requestsBase.service";
import {GroupsArchivesBaseService} from "@modules/groupsBase/archivesBase/archivesBase.service";
import {GroupsBaseService} from "@modules/groupsBase/groupsBase.service";
import {GroupsService} from "@modules/groups/groups.service";

@Injectable()
export class GroupsArchivesService {
    private utils = utils();

    constructor(
        private groupsService: GroupsService,
        private groupsBaseService: GroupsBaseService,
        private groupsRequestsBaseService: GroupsRequestsBaseService,
        private groupsArchivesBaseService: GroupsArchivesBaseService,
        private prismaService: PrismaService
    ) {}

    getBase() {
        return this.groupsArchivesBaseService;
    }

    async revertGroupFromArchive(profileId: number, recordId: number) {
        const { group, ...record } = this.utils.ifEmptyGivesError(await this.groupsArchivesBaseService.getArchiveRecordByIdAndProfileId(recordId, profileId, true), GroupArchiveNotFoundException);

        const updateGroup = this.groupsBaseService.updateGroup(record.groupId, {
            [!group.mainProfileId ? 'mainProfile' : 'secondProfile']: {
                connect: {
                    id: profileId
                }
            }
        });
        const deleteRequests = this.groupsRequestsBaseService.deleteRequestsByProfileId(profileId);
        const deleteRecord = this.groupsArchivesBaseService.deleteArchiveById(record.id, profileId);

        await this.prismaService.$transaction([updateGroup, deleteRequests, deleteRecord]);

        return this.groupsService.getGroupByProfileId(profileId);
    }

    async deleteArchiveRecordWithChecks(id: number, profileId: number) {
        const archiveRecord = this.utils.ifEmptyGivesError(await this.groupsArchivesBaseService.getArchiveRecordByIdAndProfileId(id, profileId), GroupArchiveNotFoundException);
        const group = this.utils.ifEmptyGivesError(await this.groupsBaseService.getGroupById(archiveRecord.groupId, true), GroupNotFoundException);
        const isLastUser = group.groupArchives.length === 1 && group.mainProfileId === null;

        if (isLastUser) await this.groupsService.deleteGroupById(profileId, group.id);
        else await this.groupsArchivesBaseService.deleteArchiveById(id, profileId);
    }
}
