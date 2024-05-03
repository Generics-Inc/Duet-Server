import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {PrismaService} from "../../prisma.service";
import useUtils from "../../composables/useUtils";
import { Prisma } from ".prisma/client";
import {GroupArchiveNotFoundException} from "../../errors";
import {GroupsService} from "../groups.service";
import {GroupArchive} from "@prisma/client";
import {GroupArchiveIncludes} from "../../types";

@Injectable()
export class GroupsArchivesService {
    private include: (keyof Prisma.GroupArchiveInclude)[] = ['profile', 'group'];
    private utils = useUtils();

    constructor(
        private prismaService: PrismaService,
        @Inject(forwardRef(() => GroupsService))
        private groupsService: GroupsService
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
    async getArchiveRecord<E extends boolean = false>(payload: Prisma.GroupArchiveWhereInput, extend?: E) {
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
