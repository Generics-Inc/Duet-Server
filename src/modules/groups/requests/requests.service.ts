import {Injectable} from '@nestjs/common';
import {utils} from "@root/helpers";
import {
    GroupIsFullConflictException,
    GroupRequestNotFoundException,
    UserAlreadyInGroupConflictException
} from "@root/errors";
import {GroupsRequestsBaseService} from "@modules/groupsBase/requestsBase/requestsBase.service";
import {GroupsBaseService} from "@modules/groupsBase/groupsBase.service";
import {PrismaService} from "@root/singles";

@Injectable()
export class GroupsRequestsService {
    private utils = utils();

    constructor(
        private groupsBaseService: GroupsBaseService,
        private groupsRequestsBaseService: GroupsRequestsBaseService,
        private prismaService: PrismaService
    ) {}

    getBase() {
        return this.groupsRequestsBaseService;
    }

    async isRequestExist(profileId: number, groupId: number) {
        try {
            this.utils.ifEmptyGivesError(await this.groupsRequestsBaseService.getRequestByProfileAndGroupId(profileId, groupId));
            return true;
        } catch (_) {
            return false;
        }
    }

    async actionWithRequest(actionId: number, groupId: number, action: 1 | 0) {
        const request = this.utils.ifEmptyGivesError(await this.groupsRequestsBaseService.getRequestByIdAndGroupId(actionId, groupId, true), GroupRequestNotFoundException);
        if (request.profile.groupId) throw UserAlreadyInGroupConflictException;
        else if (request.group.secondProfileId) throw GroupIsFullConflictException;

        switch (action) {
            case 0:
                return this.groupsRequestsBaseService.deleteRequestById(actionId);
            case 1:
                const deleteGroupRequests = this.groupsRequestsBaseService.deleteRequestsByGroupId(request.groupId);
                const deleteProfileRequests = this.groupsRequestsBaseService.deleteRequestsByProfileId(request.profileId);
                const updateGroup = this.groupsBaseService.updateGroup(request.groupId, {
                    inviteCode: null,
                    secondProfile: { connect: { id: request.profileId } }
                })

                return (await this.prismaService.$transaction([deleteGroupRequests, deleteProfileRequests, updateGroup]))[2];
        }
    }
}
