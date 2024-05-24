import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {Prisma, Group} from "@prisma/client";
import {utils} from "@root/helpers";
import {PrismaService} from "@root/singles";
import {GroupIncludes} from "@root/types";
import {
    DirectoryAccessDividedException,
    FileCreationException,
    GroupIsFullConflictException,
    GroupNotFoundException,
    GroupRequestConflictException,
    UserNotFoundException
} from "@root/errors";
import {UploadedPostFileReturn} from "@modules/app/decorators";
import {ProfilesService} from "@modules/users/profiles/profiles.service";
import {FilesService} from "@modules/files/files.service";
import {CreateGroupDto} from "./dto";
import {GroupsArchivesService} from "./archives/archives.service";
import {GroupsRequestsService} from "./requests/requests.service";

@Injectable()
export class GroupsService {
    private include: (keyof Prisma.GroupInclude)[] = ['groupArchives', 'groupRequests', 'mainProfile', 'secondProfile'];
    private utils = utils();

    constructor(
        private prismaService: PrismaService,
        private filesService: FilesService,
        @Inject(forwardRef(() => ProfilesService))
        private profilesService: ProfilesService,
        @Inject(forwardRef(() => GroupsArchivesService))
        private groupsArchivesService: GroupsArchivesService,
        @Inject(forwardRef(() => GroupsRequestsService))
        private groupsRequestsService: GroupsRequestsService
    ) {}

    update(id: number, data: Prisma.GroupUpdateInput) {
        return this.prismaService.group.update({
            where: { id },
            data
        });
    }

    getAllGroups<E extends boolean = false>(extend?: E) {
        return this.getGroupsWhere<E>(undefined, extend);
    }

    getGroupById<E extends boolean = false>(id: number, extend?: E) {
        return this.getUniqueGroupWhere<E>({ id }, extend);
    }
    async getGroupByProfileId<E extends boolean = false>(profileId: number, extend?: E) {
        const profile = this.utils.ifEmptyGivesError(await this.profilesService.getProfile({ id: profileId}, true), UserNotFoundException);
        if (!profile.groupId) return null;

        return await this.getUniqueGroupWhere<E>({ id: profile.groupId }, extend);
    }

    async createGroup(profileId: number, form: UploadedPostFileReturn<CreateGroupDto>) {
        const inviteCode = this.utils.createRandomString();
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
            file = form.file ? await this.filesService.upload({
                profileId,
                bucketName: 'group',
                fileName: 'main',
                fileDir: group.id.toString(),
                file: form.file.buffer
            }) : undefined;
        } catch (e) {
            console.error(e);
            await this.prismaService.group.delete({ where: { id: group.id } });
            throw FileCreationException;
        }

        if (!file) return group;

        const requestsToJoinDelete = this.groupsRequestsService.deleteRequestsByProfileId(profileId);
        const groupUpdate = this.update(group.id, { photo: file.link });

        return await this.prismaService.$transaction([requestsToJoinDelete, groupUpdate])
            .then(r => r[1]);
    }
    async updateInviteCode(groupId: number) {
        const group = this.utils.ifEmptyGivesError(await this.getGroupById(groupId, true));

        if (group.secondProfileId || group.groupArchives.length) throw GroupIsFullConflictException;

        return this.update(groupId, { inviteCode: this.utils.createRandomString() });
    }
    async sendRequestToGroup(profileId: number, inviteCode: string) {
        const group = this.utils.ifEmptyGivesError(await this.prismaService.group.findUnique({
            where: { inviteCode: inviteCode }
        }), GroupNotFoundException);

        if (await this.groupsRequestsService.isRequestExist(profileId, group.id)) throw GroupRequestConflictException;
        else if (group.secondProfileId !== null) throw GroupIsFullConflictException;

        return this.groupsRequestsService.createRequest(profileId, group.id, inviteCode);
    }
    async kickSecondPartnerFromGroup(groupId: number) {
        const group = this.utils.ifEmptyGivesError(await this.getGroupById(groupId, true));

        if (!group.secondProfileId) throw UserNotFoundException;

        return this.update(groupId, {
            secondProfile: { disconnect: true }
        });
    }
    async leaveFromGroup(profileId: number) {
        const group = this.utils.ifEmptyGivesError(await this.getGroupByProfileId(profileId, true), GroupNotFoundException);

        const isLastUser = group.secondProfileId === null;
        const isMainUser = profileId === group.mainProfile?.id;
        const modifyKey = isMainUser ? 'mainProfile' : 'secondProfile';

        const createGroupArchive = this.groupsArchivesService.createArchiveRecord(profileId, group.id);
        const updateGroup = this.update(group.id, {
            ...(!isLastUser && isMainUser ? {
                mainProfile: { connect: { id: group.secondProfileId }},
                secondProfile: { disconnect: true }
            }: { [modifyKey]: { disconnect: true }})
        })

        await this.prismaService.$transaction([createGroupArchive, updateGroup]);
    }
    async deleteById(profileId: number, groupId: number) {
        if ((await this.filesService.deleteFolder(profileId, 'group', groupId.toString())) === 3)
            throw DirectoryAccessDividedException;

        return this.prismaService.group.delete({
            where: { id: groupId }
        });
    }

    private async getUniqueGroupWhere<E extends boolean = false>(where: Prisma.GroupWhereUniqueInput, extend?: E) {
        return (await this.prismaService.group.findUnique({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupIncludes : Group;
    }
    private async getGroupsWhere<E extends boolean = false>(where: Prisma.GroupWhereInput, extend?: E) {
        return (await this.prismaService.group.findMany({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? GroupIncludes[] : Group[];
    }
}
