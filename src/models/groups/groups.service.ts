import {Injectable} from '@nestjs/common';
import {Prisma, Group} from "@prisma/client";
import {GroupIncludes} from "@root/types";
import {CreateGroupDto} from "@modules/groups/dto";
import {PrismaService} from "@modules/prisma/prisma.service";

@Injectable()
export class GroupsModelService {
    private include: (keyof Prisma.GroupInclude)[] = ['groupArchives', 'groupRequests', 'mainProfile', 'secondProfile'];

    constructor(private prismaService: PrismaService) {}

    createGroup(profileId: number, data: CreateGroupDto, inviteCode?: string) {
        return this.prismaService.group.create({
            data: {
                ...data,
                mainProfile: { connect: { id: profileId }},
                inviteCode
            }
        })
    }

    updateGroup(id: number, data: Prisma.GroupUpdateInput) {
        return this.prismaService.group.update({
            where: { id },
            data
        });
    }

    getGroupById<E extends boolean = false>(id: number, extend?: E) {
        return this.getUniqueGroup<E>({ id }, extend);
    }
    getGroupByInviteCode<E extends boolean = false>(inviteCode: string, extend?: E) {
        return this.getUniqueGroup<E>({ inviteCode }, extend);
    }

    deleteGroupById(id: number) {
        return this.prismaService.group.delete({ where: { id }});
    }

    private async getGroup<E extends boolean = false>(where: Prisma.GroupWhereInput, extend?: E) {
        return (await this.prismaService.group.findFirst({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupIncludes : Group;
    }
    private async getUniqueGroup<E extends boolean = false>(where: Prisma.GroupWhereUniqueInput, extend?: E) {
        return (await this.prismaService.group.findUnique({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupIncludes : Group;
    }
    private async getGroups<E extends boolean = false>(where: Prisma.GroupWhereInput, extend?: E) {
        return (await this.prismaService.group.findMany({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupIncludes[] : Group[];
    }
}
