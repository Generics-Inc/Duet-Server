import {Injectable} from '@nestjs/common';
import {Prisma, PrismaPromise} from "@prisma/client";
import {PrismaService} from "@modules/prisma/prisma.service";
import {GroupRequestDto, GroupRequestFullDto, GroupRequestModelDto} from "@models/groups/requests/dto";
import {GroupRequestFullPConfig, GroupRequestModelPConfig, GroupRequestPConfig} from "@models/groups/requests/config";


@Injectable()
export class GroupsRequestsModelService {
    private repo: Prisma.GroupRequestDelegate;

    constructor(prismaService: PrismaService) {
        this.repo = prismaService.groupRequest;
    }

    createRequest(profileId: number, groupId: number, inviteCode: string): PrismaPromise<GroupRequestModelDto> {
        return this.repo.create({
            data: {
                inviteCode,
                profile: { connect: { id: profileId }},
                group: { connect: { id: groupId }}
            },
            select: GroupRequestModelPConfig
        });
    }

    getModelById(id: number): PrismaPromise<GroupRequestModelDto> {
        return this.repo.findUnique({
            where: { id },
            select: GroupRequestModelPConfig
        });
    }
    getByProfileAndGroupId(profileId: number, groupId: number): PrismaPromise<GroupRequestModelDto> {
        return this.repo.findUnique({
            where: { profileId_groupId: { profileId, groupId } },
            select: GroupRequestModelPConfig
        });
    }
    getFullByIdAndGroupId(id: number, groupId: number): PrismaPromise<GroupRequestFullDto> {
        return this.repo.findUnique({
            where: { id, groupId },
            select: GroupRequestFullPConfig
        });
    }

    getManyByGroupId(groupId: number): PrismaPromise<GroupRequestDto[]> {
        return this.repo.findMany({
            where: { groupId },
            select: GroupRequestPConfig
        });
    }
    getManyByProfileId(profileId: number): PrismaPromise<GroupRequestModelDto[]> {
        return this.repo.findMany({
            where: { profileId },
            select: GroupRequestModelPConfig
        });
    }

    deleteById(id: number): PrismaPromise<GroupRequestModelDto> {
        return this.repo.delete({
            where: { id },
            select: GroupRequestModelPConfig
        });
    }
    deleteByIdAndProfileId(id: number, profileId: number): PrismaPromise<GroupRequestModelDto> {
        return this.repo.delete({
            where: { id, profileId },
            select: GroupRequestModelPConfig
        });
    }
    deleteManyByGroupId(groupId: number) {
        return this.repo.deleteMany({
            where: { groupId }
        });
    }
    deleteManyByProfileId(profileId: number) {
        return this.repo.deleteMany({
            where: { profileId },
        });
    }
}
