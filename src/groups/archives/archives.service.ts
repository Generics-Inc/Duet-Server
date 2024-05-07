import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {PrismaService} from "../../singles";
import useUtils from "../../composables/useUtils";
import { Prisma } from ".prisma/client";
import {GroupArchiveNotFoundException, GroupNotFoundException} from "../../errors";
import {GroupsService} from "../groups.service";
import {GroupArchive} from "@prisma/client";
import {GroupArchiveIncludes} from "../../types";
import {GroupsRequestsService} from "../requests/requests.service";

@Injectable()
export class GroupsArchivesService {
    private include: (keyof Prisma.GroupArchiveInclude)[] = ['profile', 'group'];
    private utils = useUtils();

    constructor(
        private prismaService: PrismaService,
        @Inject(forwardRef(() => GroupsService))
        private groupsService: GroupsService,
        @Inject(forwardRef(() => GroupsRequestsService))
        private groupsRequestsService: GroupsRequestsService
    ) {}

    async getAllArchives<E extends boolean = false>(extend?: E) {
        return (await this.prismaService.groupArchive.findMany({
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupArchiveIncludes[] : GroupArchive[];
    }
    async getArchivesByProfileId<E extends boolean = false>(profileId: number, extend?: E) {
        return (await this.prismaService.groupArchive.findMany({
            where: { profileId },
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupArchiveIncludes[] : GroupArchive[];
    }
    private async getArchiveRecordById<E extends boolean = false>(id: number, extend?: E) {
        return this.getArchiveRecord<E>({ id }, extend);
    }
    private async getArchiveRecordByIdAndProfileId<E extends boolean = false>(id: number, profileId: number, extend?: E) {
        return this.getArchiveRecord<E>({ id, profileId }, extend);
    }
    private async getArchiveRecord<E extends boolean = false>(payload: Prisma.GroupArchiveWhereInput, extend?: E) {
        return (await this.prismaService.groupArchive.findFirst({
            where: payload,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupArchiveIncludes : GroupArchive;
    }

    createArchiveRecord(profileId: number, groupId: number) {
        return this.prismaService.groupArchive.create({
            data: {
                profile: { connect: { id: profileId } },
                group: { connect: { id: groupId }}
            }
        });
    }
    async revertGroupFromArchive(profileId: number, recordId: number) {
        const { group, ...record } = this.utils.ifEmptyGivesError(await this.getArchiveRecord({
            id: recordId,
            profileId
        }, true), GroupArchiveNotFoundException);

        const updateGroup = this.groupsService.update(record.groupId, {
            [!group.mainProfileId ? 'mainProfile' : 'secondProfile']: {
                connect: {
                    id: profileId
                }
            }
        });
        const deleteRequests = this.groupsRequestsService.deleteRequestsByProfileId(profileId);
        const deleteRecord = this.deleteArchiveRecordById(record.id, profileId);

        await this.prismaService.$transaction([updateGroup, deleteRequests, deleteRecord]);

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
    async deleteArchiveRecordWithChecks(id: number, profileId: number) {
        const archiveRecord = this.utils.ifEmptyGivesError(await this.getArchiveRecordByIdAndProfileId(id, profileId), GroupArchiveNotFoundException);
        const group = this.utils.ifEmptyGivesError(await this.groupsService.getGroupById(archiveRecord.groupId, true), GroupNotFoundException);
        const isLastUser = group.groupArchives.length === 1;

        if (isLastUser) await this.groupsService.deleteById(profileId, group.id);
        else await this.deleteArchiveRecordById(id, profileId);
    }
}
