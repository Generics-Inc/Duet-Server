import {Injectable} from '@nestjs/common';
import {Prisma, PrismaPromise} from "@prisma/client";
import {PrismaService} from "@modules/prisma/prisma.service";
import {GroupArchiveDto, GroupArchiveFullDto, GroupArchiveModelDto} from "./dto";
import {GroupArchiveFullPConfig, GroupArchiveModelPConfig, GroupArchivePConfig} from "./config";


@Injectable()
export class GroupsArchivesModelService {
    private repo: Prisma.GroupArchiveDelegate;

    constructor(prismaService: PrismaService) {
        this.repo = prismaService.groupArchive;
    }

    createModel(profileId: number, groupId: number, partnerId?: number): PrismaPromise<GroupArchiveModelDto> {
        return this.repo.create({
            data: {
                profile: { connect: { id: profileId } },
                ...(partnerId ? { partner: { connect: { id: partnerId } } } : {}),
                group: { connect: { id: groupId }}
            },
            select: GroupArchiveModelPConfig
        });
    }

    getFullByIdAndProfileId(id: number, profileId: number): PrismaPromise<GroupArchiveFullDto> {
        return this.repo.findUnique({
            where: {id, profileId},
            select: GroupArchiveFullPConfig
        });
    }
    getFullByGroupIdAndProfileId(groupId: number, profileId: number): PrismaPromise<GroupArchiveFullDto> {
        return this.repo.findUnique({
            where: {groupId_profileId: {groupId, profileId}},
            select: GroupArchiveFullPConfig
        });
    }

    getManyByProfileId(profileId: number): PrismaPromise<GroupArchiveDto[]> {
        return this.repo.findMany({
            where: { profileId },
            select: GroupArchivePConfig
        });
    }

    deleteModelById(id: number, profileId: number): PrismaPromise<GroupArchiveModelDto> {
        return this.repo.delete({
            where: { id, profileId },
            select: GroupArchiveModelPConfig
        });
    }
}
