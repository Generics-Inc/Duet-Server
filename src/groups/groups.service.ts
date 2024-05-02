import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import useUtils from "../composables/useUtils";
import {FileCreationException, GroupNotFoundException, UserNotFoundException} from "../errors";
import {StatusDto} from "../globalDto";
import {Prisma, Group} from "@prisma/client";
import {GroupIncludes} from "../types";
import {GroupsArchiveService} from "./archive/archive.service";
import {ProfilesService} from "../users/profiles/profiles.service";
import {CreateGroupDto} from "./dto";
import {UploadedPostFileReturn} from "../app/decorators";
import {FilesService} from "../files/files.service";

@Injectable()
export class GroupsService {
    private include: (keyof Prisma.GroupInclude)[] = ['groupArchives', 'groupRequestsToConnect', 'mainProfile', 'secondProfile'];
    private utils = useUtils();

    constructor(
        private prismaService: PrismaService,
        private profilesService: ProfilesService,
        private filesService: FilesService,
        @Inject(forwardRef(() => GroupsArchiveService))
        private groupsArchiveService: GroupsArchiveService
    ) {}

    async isThereGroupByProfileId(profileId: number): Promise<StatusDto> {
        const profile = await this.utils.ifEmptyGivesError(this.profilesService.getProfile({ id: profileId }), UserNotFoundException);
        return { status: !!profile.groupId };
    }

    update(id: number, data: Prisma.GroupUpdateInput) {
        return this.prismaService.group.update({
            where: { id },
            data
        });
    }

    async getAllGroups<E extends boolean = false>(extend?: E) {
        return (await this.prismaService.group.findMany({
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupIncludes[] : Group[];
    }

    async getGroupByProfileId<E extends boolean = false>(profileId: number, extend?: E) {
        const profile = await this.utils.ifEmptyGivesError(this.profilesService.getProfile({ id: profileId}, true), UserNotFoundException);

        if (!profile.groupId) return null;

        return (await this.prismaService.group.findUnique({
            where: { id: profile.groupId },
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupIncludes : Group;
    }

    async createGroup(profileId: number, form: UploadedPostFileReturn<CreateGroupDto>): Promise<Group> {
        const inviteCode = this.utils.createRandomString((await this.getAllGroups()).map(group => group.inviteCode));
        const body = form.body;
        let file = undefined;

        const group = await this.prismaService.group.create({
            data: {
                ...body,
                mainProfile: { connect: { id: profileId }},
                inviteCode
            }
        });

        try {
            file = form.file ? await this.filesService.upload('group', `${group.id}`, form.file.buffer) : undefined;
        } catch (e) {
            await this.prismaService.group.delete({ where: group });
            throw FileCreationException;
        }

        return file ? await this.prismaService.group.update({
            where: { id: group.id },
            data: { photo: file.link }
        }): group;
    }
    async joinToGroup(profileId: number, inviteCode: string): Promise<Group> {
        this.utils.ifEmptyGivesError(await this.prismaService.group.findUnique({
            where: { inviteCode: inviteCode }
        }), GroupNotFoundException);

        return this.prismaService.group.update({
            where: { inviteCode: inviteCode },
            data: {
                secondProfile: { connect: { id: profileId } },
                inviteCode: null
            }
        });
    }
    async leaveFromGroup(profileId: number): Promise<GroupIncludes> {
        const group = this.utils.ifEmptyGivesError(await this.getGroupByProfileId(profileId, true), GroupNotFoundException);

        const isLastUser = !group.secondProfile?.id;
        const isMainUser = profileId === group.mainProfile?.id;
        const modifyKey = isMainUser ? 'mainProfile' : 'secondProfile';

        const createGroupArchive = this.groupsArchiveService.createArchiveRecord(profileId, group.id);
        const updateGroup = this.update(group.id, {
            ...(!isLastUser && isMainUser ? {
                mainProfile: { connect: { id: group.secondProfileId }},
                secondProfile: { disconnect: true }
            }: { [modifyKey]: { disconnect: true }})
        })

        await this.prismaService.$transaction([createGroupArchive, updateGroup]);

        return await this.getGroupByProfileId(profileId, true);
    }
}
