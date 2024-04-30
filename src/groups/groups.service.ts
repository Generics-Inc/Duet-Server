import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import useUtils from "../composables/useUtils";
import {GroupNotFoundException, UserNotFoundException} from "../errors";
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

    async getAllGroups(extend = false) {
        return this.prismaService.group.findMany({
            include: {
                profiles: extend,
                groupsArchive: extend
            }
        });
    }

    async getGroupByProfileId(profileId: number, extend = false) {
        const profile = await this.utils.ifEmptyGivesError(this.profilesService.getProfile({ id: profileId}), UserNotFoundException);

        if (!profile.groupId) return null;

        return this.prismaService.group.findUnique({
            where: { id: profile.groupId },
            include: {
                profiles: extend,
                groupsArchive: extend
            }
        });
    }

    async createGroupOld(profileId: number): Promise<Group> {
        const inviteCode = this.utils.createRandomString((await this.getAllGroups()).map(group => group.inviteCode));

        return this.prismaService.group.create({
            data: {
                name: '',
                profiles: { connect: { id: profileId } },
                inviteCode
            }
        });
    }
    async createGroup(profileId: number, form: UploadedPostFileReturn<CreateGroupDto>): Promise<Group> {
        const inviteCode = this.utils.createRandomString((await this.getAllGroups()).map(group => group.inviteCode));
        const body = form.body;

        const group = await this.prismaService.group.create({
            data: {
                name: body.name,
                profiles: { connect: { id: profileId } },
                inviteCode
            }
        });

        const file = form.file ? await this.filesService.upload('group', `${group.id}`, form.file.buffer) : undefined;

        return file ? await this.prismaService.group.update({
            where: group,
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
                profiles: { connect: { id: profileId } },
                inviteCode: null
            }
        });
    }
    async leaveFromGroup(profileId: number): Promise<GroupIncludes> {
        const group: Group = this.utils.ifEmptyGivesError(await this.getGroupByProfileId(profileId), GroupNotFoundException);

        const createGroupArchive = this.groupsArchiveService.createArchiveRecord(profileId, group.id);
        const updateGroup = this.prismaService.group.update({
            where: { id: group.id },
            data: { profiles: { disconnect: { id: profileId } } }
        })

        await this.prismaService.$transaction([createGroupArchive, updateGroup]);

        return await this.getGroupByProfileId(profileId, true);
    }
}
