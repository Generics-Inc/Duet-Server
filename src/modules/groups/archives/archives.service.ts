import {Injectable} from '@nestjs/common';
import {GroupArchiveNotFoundException, GroupNotFoundException} from "@root/errors";
import {utils} from "@root/helpers";
import {GroupsArchivesModelService} from "@models/groups/archives/archives.service";
import {GroupsRequestsModelService} from "@models/groups/requests/requests.service";
import {GroupsModelService} from "@models/groups/groups.service";
import {GroupsService} from "@modules/groups/groups.service";
import {PrismaService} from "@modules/prisma/prisma.service";


@Injectable()
export class GroupsArchivesService {
    private utils = utils();

    constructor(
        private modelService: GroupsModelService,
        private groupsService: GroupsService,
        private groupsRequestsModelService: GroupsRequestsModelService,
        private groupsArchivesModelService: GroupsArchivesModelService,
        private prismaService: PrismaService
    ) {}

    getModel() {
        return this.groupsArchivesModelService;
    }

    async getFullByProfileId() {

    }

    async revertGroupFromArchive(profileId: number, recordId: number) {
        const { group, groupId, id } = this.utils.ifEmptyGivesError(await this.groupsArchivesModelService.getFullByIdAndProfileId(recordId, profileId), GroupArchiveNotFoundException);

        console.log(await this.groupsArchivesModelService.getFullByIdAndProfileId(recordId, profileId))

        const updateGroup = this.modelService.updateModelGroup(groupId, {
            [!group.mainProfileId ? 'mainProfile' : 'secondProfile']: {
                connect: {
                    id: profileId
                }
            }
        });
        const deleteRequests = this.groupsRequestsModelService.deleteManyByProfileId(profileId);
        const deleteRecord = this.groupsArchivesModelService.deleteModelById(id, profileId);

        await this.prismaService.$transaction([updateGroup, deleteRequests, deleteRecord]);

        return this.groupsService.getByProfileId(profileId);
    }

    async deleteArchiveRecordWithChecks(id: number, profileId: number) {
        const { groupId } = this.utils.ifEmptyGivesError(await this.groupsArchivesModelService.getFullByIdAndProfileId(id, profileId), GroupArchiveNotFoundException);
        const group = this.utils.ifEmptyGivesError(await this.modelService.getById(groupId), GroupNotFoundException);
        const isLastUser = group.groupArchives.length === 1 && group.mainProfileId === null;

        if (isLastUser) await this.groupsService.deleteGroupById(profileId, group.id);
        else await this.groupsArchivesModelService.deleteModelById(id, profileId);
    }
}
