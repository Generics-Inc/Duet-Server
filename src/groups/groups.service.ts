import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {PrismaService} from "../singles";
import useUtils from "../composables/useUtils";
import {
    FileCreationException, GroupIsFullConflictException,
    GroupNotFoundException,
    GroupRequestConflictException,
    UserNotFoundException
} from "../errors";
import {Prisma, Group} from "@prisma/client";
import {GroupIncludes} from "../types";
import {GroupsArchivesService} from "./archives/archives.service";
import {ProfilesService} from "../users/profiles/profiles.service";
import {CreateGroupDto} from "./dto";
import {UploadedPostFileReturn} from "../app/decorators";
import {FilesService} from "../files/files.service";
import {GroupsRequestsService} from "./requests/requests.service";

@Injectable()
export class GroupsService {
    private include: (keyof Prisma.GroupInclude)[] = ['groupArchives', 'groupRequests', 'mainProfile', 'secondProfile'];
    private utils = useUtils();

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
            await this.prismaService.group.delete({ where: { id: group.id } });
            throw FileCreationException;
        }

        if (!file) return group;

        const requestsToJoinDelete = this.groupsRequestsService.deleteRequestsByProfileId(profileId);
        const groupUpdate = this.prismaService.group.update({
            where: { id: group.id },
            data: { photo: file.link }
        });

        return await this.prismaService.$transaction([requestsToJoinDelete, groupUpdate])
            .then(r => r[1]);
    }
    async sendRequestToGroup(profileId: number, inviteCode: string) {
        const group = this.utils.ifEmptyGivesError(await this.prismaService.group.findUnique({
            where: { inviteCode: inviteCode }
        }), GroupNotFoundException);

        if (await this.groupsRequestsService.isRequestExist(profileId, group.id)) throw GroupRequestConflictException;
        else if (group.secondProfileId !== null) throw GroupIsFullConflictException;

        return this.groupsRequestsService.createRequest(profileId, group.id, inviteCode);
    }
    async leaveFromGroup(profileId: number): Promise<GroupIncludes> {
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

        return await this.getGroupByProfileId(profileId, true);
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
