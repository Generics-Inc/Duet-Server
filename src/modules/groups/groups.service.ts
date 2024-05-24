import {Injectable} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {utils} from "@root/helpers";
import {
    DirectoryAccessDividedException,
    GroupRequestConflictException,
    GroupIsFullConflictException,
    FileCreationException,
    GroupNotFoundException,
    UserNotFoundException
} from "@root/errors";
import {UsersProfilesModelService} from "@models/users/profiles/profiles.service";
import {GroupsRequestsModelService} from "@models/groups/requests/requests.service";
import {GroupsArchivesModelService} from "@models/groups/archives/archives.service";
import {GroupsModelService} from "@models/groups/groups.service";
import {GroupsRequestsService} from "@modules/groups/requests/requests.service";
import {UploadedPostFileReturn} from "@modules/app/decorators";
import {FilesService} from "@modules/files/files.service";
import {CreateGroupDto} from "./dto";

@Injectable()
export class GroupsService {
    private utils = utils();

    constructor(
        private groupsRequestsService: GroupsRequestsService,
        private groupsModelService: GroupsModelService,
        private groupsArchivesModelService: GroupsArchivesModelService,
        private groupsRequestsModelService: GroupsRequestsModelService,
        private usersProfilesModelService: UsersProfilesModelService,
        private filesService: FilesService,
        private prismaService: PrismaService
    ) {}

    getBase() {
        return this.groupsModelService;
    }

    async createGroup(profileId: number, form: UploadedPostFileReturn<CreateGroupDto>) {
        const inviteCode = this.utils.createRandomString();
        const body = form.body;
        let file = undefined;

        const group = await this.groupsModelService.createGroup(profileId, body, inviteCode);

        try {
            file = form.file ? await this.filesService.upload({
                profileId,
                bucketName: 'group',
                fileName: 'main',
                fileDir: group.id.toString(),
                file: form.file.buffer
            }) : undefined;
        } catch (e) {
            await this.groupsModelService.deleteGroupById(group.id);
            throw FileCreationException;
        }

        if (!file) return group;

        const requestsToJoinDelete = this.groupsRequestsModelService.deleteRequestsByProfileId(profileId);
        const groupUpdate = this.groupsModelService.updateGroup(group.id, { photo: file.link });

        return await this.prismaService.$transaction([requestsToJoinDelete, groupUpdate])
            .then(r => r[1]);
    }

    async getGroupByProfileId<E extends boolean = false>(profileId: number, extend?: E) {
        const profile = this.utils.ifEmptyGivesError(await this.usersProfilesModelService.getProfileById(profileId, true), UserNotFoundException);
        if (!profile.groupId) return null;

        return await this.groupsModelService.getGroupById<E>(profile.groupId, extend);
    }

    async leaveFromGroup(profileId: number) {
        const group = this.utils.ifEmptyGivesError(await this.getGroupByProfileId(profileId, true), GroupNotFoundException);

        const isLastUser = group.secondProfileId === null;
        const isMainUser = profileId === group.mainProfile?.id;
        const modifyKey = isMainUser ? 'mainProfile' : 'secondProfile';

        const createGroupArchive = this.groupsArchivesModelService.createArchive(profileId, group.id);
        const updateGroup = this.groupsModelService.updateGroup(group.id, {
            ...(!isLastUser && isMainUser ? {
                mainProfile: { connect: { id: group.secondProfileId }},
                secondProfile: { disconnect: true }
            }: { [modifyKey]: { disconnect: true }})
        })

        await this.prismaService.$transaction([createGroupArchive, updateGroup]);
    }

    async sendRequestToGroup(profileId: number, inviteCode: string) {
        const group = this.utils.ifEmptyGivesError(await this.groupsModelService.getGroupByInviteCode(inviteCode), GroupNotFoundException);

        if (await this.groupsRequestsService.isRequestExist(profileId, group.id)) throw GroupRequestConflictException;
        else if (group.secondProfileId !== null) throw GroupIsFullConflictException;

        return this.groupsRequestsModelService.createRequest(profileId, group.id, inviteCode);
    }

    async updateInviteCode(groupId: number) {
        const group = this.utils.ifEmptyGivesError(await this.groupsModelService.getGroupById(groupId, true));

        if (group.secondProfileId || group.groupArchives.length) throw GroupIsFullConflictException;

        return this.groupsModelService.updateGroup(groupId, { inviteCode: this.utils.createRandomString() });
    }

    async kickSecondPartnerFromGroup(groupId: number) {
        const group = this.utils.ifEmptyGivesError(await this.groupsModelService.getGroupById(groupId, true));

        if (!group.secondProfileId) throw UserNotFoundException;

        return this.groupsModelService.updateGroup(groupId, {
            secondProfile: { disconnect: true }
        });
    }

    async deleteGroupById(profileId: number, groupId: number) {
        if ((await this.filesService.deleteFolder(profileId, 'group', groupId.toString())) === 3)
            throw DirectoryAccessDividedException;

        return this.groupsModelService.deleteGroupById(groupId);
    }
}
