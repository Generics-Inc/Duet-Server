import {Injectable} from '@nestjs/common';
import {utils} from "@root/helpers";
import {
    GroupIsFullConflictException,
    GroupRequestNotFoundException,
    UserAlreadyInGroupConflictException
} from "@root/errors";
import {PrismaService} from "@root/singles";
import {GroupsRequestsModelService} from "@models/groups/requests/requests.service";
import {GroupsModelService} from "@models/groups/groups.service";

@Injectable()
export class GroupsRequestsService {
    private utils = utils();

    constructor(
        private groupsModelService: GroupsModelService,
        private groupsRequestsModelService: GroupsRequestsModelService,
        private prismaService: PrismaService
    ) {}

    getBase() {
        return this.groupsRequestsModelService;
    }

    async isRequestExist(profileId: number, groupId: number) {
        try {
            this.utils.ifEmptyGivesError(await this.groupsRequestsModelService.getRequestByProfileAndGroupId(profileId, groupId));
            return true;
        } catch (_) {
            return false;
        }
    }

    async actionWithRequest(actionId: number, groupId: number, action: 1 | 0) {
        const request = this.utils.ifEmptyGivesError(await this.groupsRequestsModelService.getRequestByIdAndGroupId(actionId, groupId, true), GroupRequestNotFoundException);
        if (request.profile.groupId) throw UserAlreadyInGroupConflictException;
        else if (request.group.secondProfileId) throw GroupIsFullConflictException;

        switch (action) {
            case 0:
                return this.groupsRequestsModelService.deleteRequestById(actionId);
            case 1:
                const deleteGroupRequests = this.groupsRequestsModelService.deleteRequestsByGroupId(request.groupId);
                const deleteProfileRequests = this.groupsRequestsModelService.deleteRequestsByProfileId(request.profileId);
                const updateGroup = this.groupsModelService.updateGroup(request.groupId, {
                    inviteCode: null,
                    secondProfile: { connect: { id: request.profileId } }
                })

                return (await this.prismaService.$transaction([deleteGroupRequests, deleteProfileRequests, updateGroup]))[2];
        }
    }
}
