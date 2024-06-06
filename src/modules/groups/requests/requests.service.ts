import {Injectable} from '@nestjs/common';
import {utils} from "@root/helpers";
import {
    GroupIsFullConflictException,
    GroupRequestNotFoundException,
    UserAlreadyInGroupConflictException
} from "@root/errors";
import {GroupsRequestsModelService} from "@models/groups/requests/requests.service";
import {GroupsModelService} from "@models/groups/groups.service";
import {PrismaService} from "@modules/prisma/prisma.service";

@Injectable()
export class GroupsRequestsService {
    private utils = utils();

    constructor(
        private modelService: GroupsRequestsModelService,
        private groupsModelService: GroupsModelService,
        private prismaService: PrismaService
    ) {}

    getModel() {
        return this.modelService;
    }

    async isRequestExist(profileId: number, groupId: number) {
        try {
            this.utils.ifEmptyGivesError(await this.modelService.getByProfileAndGroupId(profileId, groupId));
            return true;
        } catch (_) {
            return false;
        }
    }

    async actionWithRequest(requestId: number, groupId: number, action: 1 | 0) {
        const request = this.utils.ifEmptyGivesError(await this.modelService.getFullByIdAndGroupId(requestId, groupId), GroupRequestNotFoundException);
        if (request.profile.groupId) throw UserAlreadyInGroupConflictException;
        else if (request.group.secondProfileId) throw GroupIsFullConflictException;

        switch (action) {
            case 0:
                return this.modelService.deleteById(requestId);
            case 1:
                const deleteGroupRequests = this.modelService.deleteManyByGroupId(request.groupId);
                const deleteProfileRequests = this.modelService.deleteManyByProfileId(request.profileId);
                const updateGroup = this.groupsModelService.updateModelGroup(request.groupId, {
                    inviteCode: null,
                    secondProfile: { connect: { id: request.profileId } }
                })

                await this.prismaService.$transaction([deleteGroupRequests, deleteProfileRequests, updateGroup]);
                return this.modelService.getModelById(requestId);
        }
    }
}
