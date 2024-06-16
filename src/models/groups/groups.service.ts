import {Injectable} from '@nestjs/common';
import {Prisma, PrismaPromise} from "@prisma/client";
import {CreateGroupDto} from "@modules/groups/dto";
import {PrismaService} from "@modules/prisma/prisma.service";
import {GroupDto, GroupModelDto, GroupPreparedDto} from "@models/groups/dto";
import {GroupModelPConfig, GroupPConfig} from "@models/groups/config";


@Injectable()
export class GroupsModelService {
    private repo: Prisma.GroupDelegate;

    constructor(prismaService: PrismaService) {
        this.repo = prismaService.group;
    }

    createModelGroup(profileId: number, data: CreateGroupDto, inviteCode?: string): PrismaPromise<GroupModelDto> {
        return this.repo.create({
            data: {
                ...data,
                mainProfile: { connect: { id: profileId }},
                inviteCode
            },
            select: GroupModelPConfig
        })
    }

    updateModelGroup(id: number, data: Prisma.GroupUpdateInput): PrismaPromise<GroupModelDto> {
        return this.repo.update({
            where: { id },
            data,
            select: GroupModelPConfig
        });
    }

    getById(id: number): PrismaPromise<GroupDto> {
        return this.repo.findUnique({
            where: { id },
            select: GroupPConfig
        });
    }
    getByInviteCode(inviteCode: string): PrismaPromise<GroupDto> {
        return this.repo.findUnique({
            where: { inviteCode },
            select: GroupPConfig
        });
    }
    getModelById(id: number): PrismaPromise<GroupModelDto> {
        return this.repo.findUnique({
            where: { id },
            select: GroupModelPConfig
        });
    }
    getPreparedById(profileId: number, id: number): Promise<GroupPreparedDto> {
        return this.repo.findUnique({
            where: { id },
            select: GroupPConfig
        }).then(r => this.prepareGroup(profileId, r));
    }

    deleteById(id: number): PrismaPromise<GroupDto> {
        return this.repo.delete({
            where: { id },
            select: GroupPConfig
        });
    }

    private prepareGroup(profileId: number, group: any) {
        if (!group) return group;
        const isMain = group.mainProfile?.id === profileId;
        group.partner = group[isMain ? 'secondProfile' : 'mainProfile'];
        delete group.mainProfile;
        delete group.secondProfile;
        return group;
    }
}
