import {Injectable} from '@nestjs/common';
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
import {PrismaService} from "@modules/prisma/prisma.service";
import {FilesService} from "@modules/files/files.service";
import {CreateGroupDto} from "./dto";

@Injectable()
export class GroupsService {
    private utils = utils();

    constructor(
        private modelService: GroupsModelService,
        private groupsRequestsService: GroupsRequestsService,
        private groupsArchivesModelService: GroupsArchivesModelService,
        private groupsRequestsModelService: GroupsRequestsModelService,
        private usersProfilesModelService: UsersProfilesModelService,
        private filesService: FilesService,
        private prismaService: PrismaService
    ) {}

    getModel() {
        return this.modelService;
    }

    async createGroup(profileId: number, form: UploadedPostFileReturn<CreateGroupDto>) {
        const inviteCode = this.utils.createRandomString();
        const body = form.body;
        let fileLink = undefined;

        const group = await this.modelService.createModelGroup(profileId, body, inviteCode);

        try {
            fileLink = form.file ? await this.filesService.upload({
                profileId,
                bucketName: 'group',
                fileName: 'main',
                fileDir: group.id.toString(),
                file: form.file.buffer
            }) : undefined;
        } catch (e) {
            await this.modelService.deleteById(group.id);
            throw FileCreationException;
        }

        if (!fileLink) return group;

        const requestsToJoinDelete = this.groupsRequestsModelService.deleteManyByProfileId(profileId);
        const groupUpdate = this.modelService.updateModelGroup(group.id, { photo: fileLink });

        return await this.prismaService.$transaction([requestsToJoinDelete, groupUpdate])
            .then(r => r[1]);
    }

    async getByProfileId(profileId: number) {
        const profile = this.utils.ifEmptyGivesError(await this.usersProfilesModelService.getById(profileId), UserNotFoundException);
        if (!profile.groupId) return null;

        return this.modelService.getById(profile.groupId);
    }

    async leaveFromGroup(profileId: number) {
        const group = this.utils.ifEmptyGivesError(await this.getByProfileId(profileId), GroupNotFoundException);

        const isLastUser = group.secondProfileId === null;
        const isMainUser = profileId === group.mainProfileId;
        const modifyKey = isMainUser ? 'mainProfile' : 'secondProfile';
        const modifyKeyPartner = !isMainUser ? 'mainProfile' : 'secondProfile';

        const createGroupArchive = this.groupsArchivesModelService.createModel(profileId, group.id, group[modifyKeyPartner]?.id);
        const updateGroup = this.modelService.updateModelGroup(group.id, {
            ...(!isLastUser && isMainUser ? {
                mainProfile: { connect: { id: group.secondProfileId }},
                secondProfile: { disconnect: true }
            }: { [modifyKey]: { disconnect: true }})
        })

        await this.prismaService.$transaction([createGroupArchive, updateGroup]);
    }

    async sendRequestToGroup(profileId: number, inviteCode: string) {
        const group = this.utils.ifEmptyGivesError(await this.modelService.getByInviteCode(inviteCode), GroupNotFoundException);

        if (await this.groupsRequestsService.isRequestExist(profileId, group.id)) throw GroupRequestConflictException;
        else if (group.secondProfileId !== null) throw GroupIsFullConflictException;

        return this.groupsRequestsModelService.createRequest(profileId, group.id, inviteCode);
    }

    async updateInviteCode(groupId: number) {
        const group = this.utils.ifEmptyGivesError(await this.modelService.getById(groupId));

        if (group.secondProfileId || group.archives.length) throw GroupIsFullConflictException;

        return this.modelService.updateModelGroup(groupId, { inviteCode: this.utils.createRandomString() });
    }

    async kickSecondPartnerFromGroup(groupId: number) {
        const group = this.utils.ifEmptyGivesError(await this.modelService.getById(groupId));

        if (!group.secondProfileId && !group.archives.length) throw UserNotFoundException;

        return this.modelService.updateModelGroup(groupId, {
            secondProfile: { disconnect: true },
            archives: { deleteMany: {} }
        });
    }

    async deleteGroupById(profileId: number, groupId: number) {
        if ((await this.filesService.deleteFolder(profileId, 'group', groupId.toString())) === 3)
            throw DirectoryAccessDividedException;

        return this.modelService.deleteById(groupId);
    }
}
