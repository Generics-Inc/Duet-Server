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
        private modelService: GroupsArchivesModelService,
        private groupsModelService: GroupsModelService,
        private groupsService: GroupsService,
        private groupsRequestsModelService: GroupsRequestsModelService,
        private prismaService: PrismaService
    ) {}

    getModel() {
        return this.modelService;
    }

    async revertGroupFromArchive(profileId: number, recordId: number) {
        const { group, groupId, id } = this.utils.ifEmptyGivesError(await this.modelService.getFullByIdAndProfileId(recordId, profileId), GroupArchiveNotFoundException);

        const updateGroup = this.groupsModelService.updateModelGroup(groupId, {
            [!group.mainProfileId ? 'mainProfile' : 'secondProfile']: {
                connect: {
                    id: profileId
                }
            }
        });
        const deleteRequests = this.groupsRequestsModelService.deleteManyByProfileId(profileId);
        const deleteRecord = this.modelService.deleteModelById(id, profileId);

        await this.prismaService.$transaction([updateGroup, deleteRequests, deleteRecord]);

        return this.groupsService.getByProfileId(profileId);
    }

    async deleteArchiveRecordWithChecks(id: number, profileId: number) {
        const { groupId } = this.utils.ifEmptyGivesError(await this.modelService.getFullByIdAndProfileId(id, profileId), GroupArchiveNotFoundException);
        const group = this.utils.ifEmptyGivesError(await this.groupsModelService.getById(groupId), GroupNotFoundException);

        const isGroupEmpty = group.mainProfileId === null && group.secondProfileId === null;
        const isLastUser = group.archives.length === 1 && isGroupEmpty;
        const isMain = isLastUser || group.mainProfileId === null;

        if (isLastUser) {
            await this.groupsService.deleteGroupById(profileId, group.id);
        } else {
            if (isMain) {
                const deleteRecord = this.modelService.deleteModelById(id, profileId);
                const updateGroup = this.groupsModelService.updateModelGroup(groupId, {
                    mainProfile: { connect: { id: group.secondProfileId } },
                    secondProfile: { disconnect: true }
                });

                await this.prismaService.$transaction([deleteRecord, updateGroup])
                    .then(r => r[0]);
            } else {
                await this.modelService.deleteModelById(id, profileId);
            }
        }
    }
}
