import {Injectable} from '@nestjs/common';
import {GroupArchive, Prisma} from "@prisma/client";
import {PrismaService} from "@root/singles";
import {GroupArchiveIncludes} from "@root/types";

@Injectable()
export class GroupsArchivesBaseService {
    private include: (keyof Prisma.GroupArchiveInclude)[] = ['profile', 'group'];

    constructor(private prismaService: PrismaService) {}

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

    async getArchiveRecordById<E extends boolean = false>(id: number, extend?: E) {
        return this.getArchiveRecord<E>({ id }, extend);
    }

    async getArchiveRecordByIdAndProfileId<E extends boolean = false>(id: number, profileId: number, extend?: E) {
        return this.getArchiveRecord<E>({ id, profileId }, extend);
    }

    createArchiveRecord(profileId: number, groupId: number) {
        return this.prismaService.groupArchive.create({
            data: {
                profile: { connect: { id: profileId } },
                group: { connect: { id: groupId }}
            }
        });
    }

    deleteArchiveRecordById(id: number, profileId: number) {
        return this.prismaService.groupArchive.delete({
            where: {
                id,
                profileId
            }
        });
    }

    private async getArchiveRecord<E extends boolean = false>(payload: Prisma.GroupArchiveWhereInput, extend?: E) {
        return (await this.prismaService.groupArchive.findFirst({
            where: payload,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupArchiveIncludes : GroupArchive;
    }
}
