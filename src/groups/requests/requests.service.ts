import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {PrismaService} from "../../singles";
import useUtils from "../../composables/useUtils";
import { Prisma } from ".prisma/client";
import {GroupsService} from "../groups.service";
import {GroupRequestIncludes} from "../../types";
import {GroupRequest} from "@prisma/client";
import {
    GroupIsFullConflictException,
    GroupRequestNotFoundException,
    UserAlreadyInGroupConflictException
} from "../../errors";

@Injectable()
export class GroupsRequestsService {
    private include: (keyof Prisma.GroupRequestInclude)[] = ['group', 'profile'];
    private utils = useUtils();

    constructor(
        private prismaService: PrismaService,
        @Inject(forwardRef(() => GroupsService))
        private groupsService: GroupsService
    ) {}

    async isRequestExist(profileId: number, groupId: number) {
        try {
            this.utils.ifEmptyGivesError(await this.getRequestByProfileAndGroupId(profileId, groupId));
            return true;
        } catch (_) {
            return false;
        }
    }

    createRequest(profileId: number, groupId: number, inviteCode: string) {
        return this.prismaService.groupRequest.create({
            data: {
                inviteCode,
                profile: { connect: { id: profileId }},
                group: { connect: { id: groupId }}
            }
        });
    }


    getRequestById<E extends boolean = false>(id: number, extend?: E) {
        return this.getRequestWhere<E>({ id }, extend);
    }
    getRequestByIdAndGroupId<E extends boolean = false>(id: number, groupId: number, extend?: E) {
        return this.getRequestWhere<E>({ id, groupId }, extend);
    }
    getRequestByProfileAndGroupId<E extends boolean = false>(profileId: number, groupId: number, extend?: E) {
        return this.getRequestWhere<E>({ profileId, groupId }, extend);
    }

    getAllRequests<E extends boolean = false>(extend?: E) {
        return this.getRequestsWhere<E>(undefined, extend);
    }
    getRequestsByGroupId<E extends boolean = false>(groupId: number, extend?: E) {
        return this.getRequestsWhere<E>({ groupId }, extend);
    }
    getRequestsByProfileId<E extends boolean = false>(profileId: number, extend?: E) {
        return this.getRequestsWhere<E>({ profileId }, extend);
    }

    async actionWithRequest(actionId: number, groupId: number, action: 1 | 0) {
        const request = this.utils.ifEmptyGivesError(await this.getRequestByIdAndGroupId(actionId, groupId, true), GroupRequestNotFoundException);
        if (request.profile.groupId) throw UserAlreadyInGroupConflictException;
        else if (request.group.secondProfileId) throw GroupIsFullConflictException;

        switch (action) {
            case 0:
                return this.deleteRequestById(actionId);
            case 1:
                const deleteGroupRequests = this.deleteRequestsByGroupId(request.groupId);
                const deleteProfileRequests = this.deleteRequestsByProfileId(request.profileId);
                const updateGroup = this.groupsService.update(request.groupId, {
                    inviteCode: null,
                    secondProfile: { connect: { id: request.profileId } }
                })

                return (await this.prismaService.$transaction([deleteGroupRequests, deleteProfileRequests, updateGroup]))[2];
        }
    }

    deleteRequestById(id: number) {
        return this.prismaService.groupRequest.delete({ where: { id } });
    }
    deleteRequest(profileId: number, id: number) {
        return this.prismaService.groupRequest.delete({
            where: {
                id,
                profileId
            }
        });
    }

    deleteRequestsByGroupId(groupId: number) {
        return this.prismaService.groupRequest.deleteMany({ where: { groupId } });
    }
    deleteRequestsByProfileId(profileId: number) {
        return this.prismaService.groupRequest.deleteMany({ where: { profileId } });
    }

    private async getRequestWhere<E extends boolean = false>(where?: Prisma.GroupRequestWhereInput, extend?: E) {
        return (await this.prismaService.groupRequest.findFirst({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupRequestIncludes : GroupRequest;
    }
    private async getRequestsWhere<E extends boolean = false>(where?: Prisma.GroupRequestWhereInput, extend?: E) {
        return (await this.prismaService.groupRequest.findMany({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupRequestIncludes[] : GroupRequest[];
    }
}
