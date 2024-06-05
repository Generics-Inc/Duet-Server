import {GroupArchive, Prisma, Profile, User} from "@prisma/client";
import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {GroupIncludes} from "@root/types";
import {AccessToEntity} from "@root/helpers";
import {FileCreationException, ProfileAccessDividedException} from "@root/errors";
import {GroupsArchivesModelService} from "@models/groups/archives/archives.service";
import {UsersProfilesModelService} from "@models/users/profiles/profiles.service";
import {GroupsModelService} from "@models/groups/groups.service";
import {UsersModelService} from "@models/users/users.service";
import {PrismaService} from "@modules/prisma/prisma.service";
import {FilesService} from "@modules/files/files.service";
import {GroupStatusDto, GroupStatusPartner, GroupStatusSelf, ProfileIdDto} from "./dto";


@Injectable()
export class UsersProfilesService {
    constructor(
        private groupsModelService: GroupsModelService,
        private groupsArchivesModelService: GroupsArchivesModelService,
        private usersModelService: UsersModelService,
        private usersProfilesModelService: UsersProfilesModelService,
        private filesService: FilesService,
        private httpService: HttpService,
        private prismaService: PrismaService
    ) {}

    getBase() {
        return this.usersProfilesModelService;
    }

    async createUser(
        userData: Omit<Prisma.UserCreateInput, 'profile' | 'sessions'>,
        profileData: Omit<Prisma.ProfileCreateWithoutUserInput, 'group' | 'groupsArchive'>
    ): Promise<User> {
        const user = await this.prismaService.user.create({
            data: {
                ...userData,
                profile: {
                    create: profileData
                }
            }
        });

        if (profileData.photo) {
            try {
                const uploadedPhoto = await this.httpService.axiosRef.get(profileData.photo, {
                    responseType: 'arraybuffer'
                }).then(r => Buffer.from(r.data));
                profileData.photo = uploadedPhoto ? (await this.filesService.upload({
                    profileId: user.id,
                    bucketName: 'profile',
                    fileName: 'main',
                    fileDir: user.id.toFixed(),
                    file: uploadedPhoto
                })) : undefined;
            } catch (e) {
                console.error(e);
                await this.usersModelService.deleteUserById(user.id);
                throw FileCreationException;
            }
        } else {
            profileData.photo = undefined;
        }

        await this.usersProfilesModelService.updateProfile(user.id, { photo: profileData.photo });
        return await this.usersModelService.getUserById(user.id);
    }

    async statusAboutProfile(profile: Profile): Promise<GroupStatusDto> {
        const getSelfStatusKey = (archive: GroupArchive[], group?: GroupIncludes): GroupStatusSelf => {
            if (group) return GroupStatusSelf.IN_GROUP;
            else if (archive.length) return GroupStatusSelf.NOT_IN_GROUP_WITH_ARCHIVE;
            else return GroupStatusSelf.NOT_IN_GROUP;
        };
        const getPartnerStatusKey = (partnerId?: number, group?: GroupIncludes): GroupStatusPartner => {
            if (!group) return GroupStatusPartner.NO_PARTNER;
            else if (partnerId !== null) return GroupStatusPartner.IN_GROUP;
            else if (group.groupArchives.length) return GroupStatusPartner.GROUP_IN_ARCHIVE;
            else if (!group.inviteCode) return GroupStatusPartner.LEAVED;
            else return GroupStatusPartner.NO_PARTNER;
        };


        const group = profile.groupId ? await this.groupsModelService.getGroupById(profile.groupId, true) : null;
        const archive = await this.groupsArchivesModelService.getArchivesByProfileId(profile.id);
        const isMain = group ? group.mainProfileId === profile.id : false;
        const partnerId = group?.[isMain ? 'secondProfileId' : 'mainProfileId'] ??  null;

        return {
            selfId: profile.id,
            partnerId: partnerId ?? group?.groupArchives[0]?.profileId,
            selfStatus: getSelfStatusKey(archive, group),
            partnerStatus: getPartnerStatusKey(partnerId, group),
            isMainInGroup: isMain
        };
    }

    async getProfileById(reqProfileId: number, resProfileId: number): Promise<ProfileIdDto> {
        if (await AccessToEntity.accessToProfile(this.usersProfilesModelService, this.groupsModelService, reqProfileId, resProfileId).then(r => !r.status))
            throw ProfileAccessDividedException;

        const profile = await this.usersProfilesModelService.getProfileById(resProfileId);
        const groupStatus = await this.statusAboutProfile(profile);
        const group = profile.groupId ? await this.groupsModelService.getGroupById(profile.groupId) : null;
        const partner = groupStatus.partnerId ? await this.usersProfilesModelService.getProfileById(groupStatus.partnerId) : null;

        return {
            ...profile,
            group,
            partner,
            groupStatus
        };
    }
}
