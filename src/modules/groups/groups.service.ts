import {Injectable} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {utils} from "@root/helpers";
import {
    DirectoryAccessDividedException,
    FileCreationException, GroupIsFullConflictException,
    GroupNotFoundException, GroupRequestConflictException,
    UserNotFoundException
} from "@root/errors";
import {GroupsArchivesBaseService} from "@modules/groupsBase/archivesBase/archivesBase.service";
import {GroupsRequestsBaseService} from "@modules/groupsBase/requestsBase/requestsBase.service";
import {UsersProfilesBaseService} from "@modules/usersBase/profilesBase/profilesBase.service";
import {GroupsRequestsService} from "@modules/groups/requests/requests.service";
import {GroupsBaseService} from "@modules/groupsBase/groupsBase.service";
import {UploadedPostFileReturn} from "@modules/app/decorators";
import {FilesService} from "@modules/files/files.service";
import {CreateGroupDto} from "./dto";


@Injectable()
export class GroupsService {
    private utils = utils();

    constructor(
        private groupsRequestsService: GroupsRequestsService,
        private groupsBaseService: GroupsBaseService,
        private groupsArchivesBaseService: GroupsArchivesBaseService,
        private groupsRequestsBaseService: GroupsRequestsBaseService,
        private usersProfilesBaseService: UsersProfilesBaseService,
        private filesService: FilesService,
        private prismaService: PrismaService
    ) {}

    getBase() {
        return this.groupsBaseService;
    }

    async createGroup(profileId: number, form: UploadedPostFileReturn<CreateGroupDto>) {
        const inviteCode = this.utils.createRandomString();
        const body = form.body;
        let file = undefined;

        const group = await this.groupsBaseService.createGroup(profileId, body, inviteCode);

        try {
            file = form.file ? await this.filesService.upload({
                profileId,
                bucketName: 'group',
                fileName: 'main',
                fileDir: group.id.toString(),
                file: form.file.buffer
            }) : undefined;
        } catch (e) {
            await this.groupsBaseService.deleteGroupById(group.id);
            throw FileCreationException;
        }

        if (!file) return group;

        const requestsToJoinDelete = this.groupsRequestsBaseService.deleteRequestsByProfileId(profileId);
        const groupUpdate = this.groupsBaseService.updateGroup(group.id, { photo: file.link });

        return await this.prismaService.$transaction([requestsToJoinDelete, groupUpdate])
            .then(r => r[1]);
    }

    async getGroupByProfileId<E extends boolean = false>(profileId: number, extend?: E) {
        const profile = this.utils.ifEmptyGivesError(await this.usersProfilesBaseService.getProfileById(profileId, true), UserNotFoundException);
        if (!profile.groupId) return null;

        return await this.groupsBaseService.getGroupById<E>(profile.groupId, extend);
    }

    async leaveFromGroup(profileId: number) {
        const group = this.utils.ifEmptyGivesError(await this.getGroupByProfileId(profileId, true), GroupNotFoundException);

        const isLastUser = group.secondProfileId === null;
        const isMainUser = profileId === group.mainProfile?.id;
        const modifyKey = isMainUser ? 'mainProfile' : 'secondProfile';

        const createGroupArchive = this.groupsArchivesBaseService.createArchive(profileId, group.id);
        const updateGroup = this.groupsBaseService.updateGroup(group.id, {
            ...(!isLastUser && isMainUser ? {
                mainProfile: { connect: { id: group.secondProfileId }},
                secondProfile: { disconnect: true }
            }: { [modifyKey]: { disconnect: true }})
        })

        await this.prismaService.$transaction([createGroupArchive, updateGroup]);
    }

    async sendRequestToGroup(profileId: number, inviteCode: string) {
        const group = this.utils.ifEmptyGivesError(await this.groupsBaseService.getGroupByInviteCode(inviteCode), GroupNotFoundException);

        if (await this.groupsRequestsService.isRequestExist(profileId, group.id)) throw GroupRequestConflictException;
        else if (group.secondProfileId !== null) throw GroupIsFullConflictException;

        return this.groupsRequestsBaseService.createRequest(profileId, group.id, inviteCode);
    }

    async updateInviteCode(groupId: number) {
        const group = this.utils.ifEmptyGivesError(await this.groupsBaseService.getGroupById(groupId, true));

        if (group.secondProfileId || group.groupArchives.length) throw GroupIsFullConflictException;

        return this.groupsBaseService.updateGroup(groupId, { inviteCode: this.utils.createRandomString() });
    }

    async kickSecondPartnerFromGroup(groupId: number) {
        const group = this.utils.ifEmptyGivesError(await this.groupsBaseService.getGroupById(groupId, true));

        if (!group.secondProfileId) throw UserNotFoundException;

        return this.groupsBaseService.updateGroup(groupId, {
            secondProfile: { disconnect: true }
        });
    }

    async deleteGroupById(profileId: number, groupId: number) {
        if ((await this.filesService.deleteFolder(profileId, 'group', groupId.toString())) === 3)
            throw DirectoryAccessDividedException;

        return this.groupsBaseService.deleteGroupById(groupId);
    }
}
