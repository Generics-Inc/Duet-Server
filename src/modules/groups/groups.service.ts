import {Injectable} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {utils} from "@root/helpers";
import {
    DirectoryAccessDividedException,
    FileCreationException,
    GroupNotFoundException,
    UserNotFoundException
} from "@root/errors";
import {GroupsArchivesBaseService} from "@modules/groupsBase/archivesBase/archivesBase.service";
import {GroupsRequestsBaseService} from "@modules/groupsBase/requestsBase/requestsBase.service";
import {ProfilesBaseService} from "@modules/usersBase/profilesBase/profilesBase.service";
import {GroupsBaseService} from "@modules/groupsBase/groupsBase.service";
import {UploadedPostFileReturn} from "@modules/app/decorators";
import {FilesService} from "@modules/files/files.service";
import {CreateGroupDto} from "./dto";


@Injectable()
export class GroupsService {
    private utils = utils();

    constructor(
        private groupsBaseService: GroupsBaseService,
        private groupsArchivesBaseService: GroupsArchivesBaseService,
        private groupsRequestsBaseService: GroupsRequestsBaseService,
        private profilesBaseService: ProfilesBaseService,
        private filesService: FilesService,
        private prismaService: PrismaService
    ) {}

    async getGroupByProfileId<E extends boolean = false>(profileId: number, extend?: E) {
        const profile = this.utils.ifEmptyGivesError(await this.profilesBaseService.getProfile({ id: profileId}, true), UserNotFoundException);
        if (!profile.groupId) return null;

        return await this.groupsBaseService.getGroupById<E>(profile.groupId, extend);
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

        const requestsToJoinDelete = this.groupsRequestsBaseService.deleteRequestsByProfileId(profileId);
        const groupUpdate = this.groupsBaseService.update(group.id, { photo: file.link });

        return await this.prismaService.$transaction([requestsToJoinDelete, groupUpdate])
            .then(r => r[1]);
    }

    async leaveFromGroup(profileId: number) {
        const group = this.utils.ifEmptyGivesError(await this.getGroupByProfileId(profileId, true), GroupNotFoundException);

        const isLastUser = group.secondProfileId === null;
        const isMainUser = profileId === group.mainProfile?.id;
        const modifyKey = isMainUser ? 'mainProfile' : 'secondProfile';

        const createGroupArchive = this.groupsArchivesBaseService.createArchiveRecord(profileId, group.id);
        const updateGroup = this.groupsBaseService.update(group.id, {
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
}
