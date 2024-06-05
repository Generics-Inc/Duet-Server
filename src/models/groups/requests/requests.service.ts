import {Injectable} from '@nestjs/common';
import {GroupRequest, Prisma} from "@prisma/client";
import {GroupRequestIncludes} from "@root/types";
import {PrismaService} from "@modules/prisma/prisma.service";

@Injectable()
export class GroupsRequestsModelService {
    private include: (keyof Prisma.GroupRequestInclude)[] = ['group', 'profile'];

    constructor(private prismaService: PrismaService) {}

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
        return this.getUniqueRequest<E>({ id }, extend);
    }
    getRequestByIdAndGroupId<E extends boolean = false>(id: number, groupId: number, extend?: E) {
        return this.getRequest<E>({ id, groupId }, extend);
    }
    getRequestByProfileAndGroupId<E extends boolean = false>(profileId: number, groupId: number, extend?: E) {
        return this.getRequest<E>({ profileId, groupId }, extend);
    }

    getRequestsByGroupId<E extends boolean = false>(groupId: number, extend?: E) {
        return this.getRequests<E>({ groupId }, extend);
    }
    getRequestsByProfileId<E extends boolean = false>(profileId: number, extend?: E) {
        return this.getRequests<E>({ profileId }, extend);
    }

    deleteRequestById(id: number) {
        return this.prismaService.groupRequest.delete({ where: { id } });
    }
    deleteRequestsByProfileId(profileId: number) {
        return this.prismaService.groupRequest.deleteMany({ where: { profileId } });
    }
    deleteRequestByIdAndProfileId(id: number, profileId: number) {
        return this.prismaService.groupRequest.delete({ where: { id, profileId } });
    }
    deleteRequestsByGroupId(groupId: number) {
        return this.prismaService.groupRequest.deleteMany({ where: { groupId } });
    }

    private async getRequest<E extends boolean = false>(where?: Prisma.GroupRequestWhereInput, extend?: E) {
        return (await this.prismaService.groupRequest.findFirst({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupRequestIncludes : GroupRequest;
    }
    private async getUniqueRequest<E extends boolean = false>(where?: Prisma.GroupRequestWhereUniqueInput, extend?: E) {
        return (await this.prismaService.groupRequest.findUnique({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupRequestIncludes : GroupRequest;
    }
    private async getRequests<E extends boolean = false>(where?: Prisma.GroupRequestWhereInput, extend?: E) {
        return (await this.prismaService.groupRequest.findMany({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupRequestIncludes[] : GroupRequest[];
    }
}
