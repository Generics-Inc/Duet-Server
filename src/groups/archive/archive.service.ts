import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {PrismaService} from "../../prisma.service";
import useUtils from "../../composables/useUtils";
import { Prisma } from ".prisma/client";
import {GroupArchiveNotFoundException} from "../../errors";
import {GroupsService} from "../groups.service";
import {Group} from "@prisma/client";

@Injectable()
export class GroupsArchiveService {
    private utils = useUtils();

    constructor(
        private prismaService: PrismaService,
        @Inject(forwardRef(() => GroupsService))
        private groupsService: GroupsService
    ) {}

    getAllArchive(extend = false) {
        return this.prismaService.groupArchive.findMany({
            include: {
                profile: extend,
                group: extend
            }
        });
    }
    getArchiveByProfileId(profileId: number, extend = false) {
        return this.prismaService.groupArchive.findMany({
            where: { profileId },
            include: {
                profile: extend,
                group: extend
            }
        });
    }

    getArchiveRecord(payload: Prisma.GroupArchiveWhereInput, extend = false) {
        return this.prismaService.groupArchive.findFirst({
            where: payload,
            include: {
                profile: extend,
                group: extend
            }
        });
    }

    createArchiveRecord(profileId: number, groupId: number) {
        return this.prismaService.groupArchive.create({
            data: {
                profile: { connect: { id: profileId } },
                group: { connect: { id: groupId }}
            }
        });
    }

    async revertGroupFromArchive(profileId: number, recordId: number): Promise<Group> {
        const record = this.utils.ifEmptyGivesError(await this.getArchiveRecord({
            id: recordId,
            profileId
        }), GroupArchiveNotFoundException);

        const updateGroup = this.groupsService.update(record.groupId, {
            profiles: {
                connect: {
                    id: profileId
                }
            }
        });
        const deleteRecord = this.deleteArchiveRecordById(record.id, profileId);

        await this.prismaService.$transaction([updateGroup, deleteRecord]);

        return this.groupsService.getGroupByProfileId(profileId);
    }
    deleteArchiveRecordById(id: number, profileId: number) {
        return this.prismaService.groupArchive.delete({
            where: {
                id,
                profileId
            }
        });
    }
}
