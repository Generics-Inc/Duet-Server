import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {Prisma, Group} from "@prisma/client";
import {utils} from "@root/helpers";
import {PrismaService} from "@root/singles";
import {GroupIncludes} from "@root/types";
import {
    GroupIsFullConflictException,
    GroupNotFoundException,
    GroupRequestConflictException,
    UserNotFoundException
} from "@root/errors";
import {GroupsRequestsBaseService} from "./requestsBase/requestsBase.service";

@Injectable()
export class GroupsBaseService {
    private include: (keyof Prisma.GroupInclude)[] = ['groupArchives', 'groupRequests', 'mainProfile', 'secondProfile'];
    private utils = utils();

    constructor(
        @Inject(forwardRef(() => GroupsRequestsBaseService))
        private groupsRequestsBaseService: GroupsRequestsBaseService,
        private prismaService: PrismaService
    ) {}

    update(id: number, data: Prisma.GroupUpdateInput) {
        return this.prismaService.group.update({
            where: { id },
            data
        });
    }

    getAllGroups<E extends boolean = false>(extend?: E) {
        return this.getGroupsWhere<E>(undefined, extend);
    }

    getGroupById<E extends boolean = false>(id: number, extend?: E) {
        return this.getUniqueGroupWhere<E>({ id }, extend);
    }

    async updateInviteCode(groupId: number) {
        const group = this.utils.ifEmptyGivesError(await this.getGroupById(groupId, true));

        if (group.secondProfileId || group.groupArchives.length) throw GroupIsFullConflictException;

        return this.update(groupId, { inviteCode: this.utils.createRandomString() });
    }

    async sendRequestToGroup(profileId: number, inviteCode: string) {
        const group = this.utils.ifEmptyGivesError(await this.prismaService.group.findUnique({
            where: { inviteCode: inviteCode }
        }), GroupNotFoundException);

        if (await this.groupsRequestsBaseService.isRequestExist(profileId, group.id)) throw GroupRequestConflictException;
        else if (group.secondProfileId !== null) throw GroupIsFullConflictException;

        return this.groupsRequestsBaseService.createRequest(profileId, group.id, inviteCode);
    }

    async kickSecondPartnerFromGroup(groupId: number) {
        const group = this.utils.ifEmptyGivesError(await this.getGroupById(groupId, true));

        if (!group.secondProfileId) throw UserNotFoundException;

        return this.update(groupId, {
            secondProfile: { disconnect: true }
        });
    }

    private async getUniqueGroupWhere<E extends boolean = false>(where: Prisma.GroupWhereUniqueInput, extend?: E) {
        return (await this.prismaService.group.findUnique({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupIncludes : Group;
    }
    private async getGroupsWhere<E extends boolean = false>(where: Prisma.GroupWhereInput, extend?: E) {
        return (await this.prismaService.group.findMany({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupIncludes[] : Group[];
    }
}
