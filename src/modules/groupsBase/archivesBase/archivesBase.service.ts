import {Injectable} from '@nestjs/common';
import {GroupArchive, Prisma} from "@prisma/client";
import {PrismaService} from "@root/singles";
import {GroupArchiveIncludes} from "@root/types";

@Injectable()
export class GroupsArchivesBaseService {
    private include: (keyof Prisma.GroupArchiveInclude)[] = ['profile', 'group'];

    constructor(private prismaService: PrismaService) {}

    createArchive(profileId: number, groupId: number) {
        return this.prismaService.groupArchive.create({
            data: {
                profile: { connect: { id: profileId } },
                group: { connect: { id: groupId }}
            }
        });
    }

    getArchiveRecordById<E extends boolean = false>(id: number, extend?: E) {
        return this.getUniqueArchive<E>({ id }, extend);
    }
    getArchivesByProfileId<E extends boolean = false>(id: number, extend?: E) {
        return this.getArchives<E>({ profileId: id }, extend);
    }
    getArchiveRecordByIdAndProfileId<E extends boolean = false>(id: number, profileId: number, extend?: E) {
        return this.getArchive<E>({ id, profileId }, extend);
    }

    deleteArchiveById(id: number, profileId: number) {
        return this.prismaService.groupArchive.delete({ where: { id, profileId }});
    }

    private async getArchive<E extends boolean = false>(where?: Prisma.GroupArchiveWhereInput, extend?: E) {
        return (await this.prismaService.groupArchive.findFirst({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupArchiveIncludes : GroupArchive;
    }
    private async getUniqueArchive<E extends boolean = false>(where?: Prisma.GroupArchiveWhereUniqueInput, extend?: E) {
        return (await this.prismaService.groupArchive.findUnique({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupArchiveIncludes : GroupArchive;
    }
    private async getArchives<E extends boolean = false>(where?: Prisma.GroupArchiveWhereInput, extend?: E) {
        return (await this.prismaService.groupArchive.findMany({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupArchiveIncludes[] : GroupArchive[];
    }
}
