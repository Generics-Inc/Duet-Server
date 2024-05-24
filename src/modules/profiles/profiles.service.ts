import {GroupArchive, Prisma, Profile, User} from "@prisma/client";
import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {GroupIncludes} from "@root/types";
import {PrismaService} from "@root/singles";
import {FileCreationException} from "@root/errors";
import {GroupsArchivesBaseService} from "@modules/groupsBase/archivesBase/archivesBase.service";
import {GroupsBaseService} from "@modules/groupsBase/groupsBase.service";
import {FilesService} from "@modules/files/files.service";
import {ProfilesBaseService} from "@modules/usersBase/profilesBase/profilesBase.service";
import {UsersBaseService} from "@modules/usersBase/usersBase.service";
import {GroupStatusDto, GroupStatusPartner, GroupStatusSelf} from "./dto";


@Injectable()
export class ProfilesService {
    constructor(
        private groupsBaseService: GroupsBaseService,
        private groupsArchivesBaseService: GroupsArchivesBaseService,
        private usersBaseService: UsersBaseService,
        private profilesBaseService: ProfilesBaseService,
        private filesService: FilesService,
        private httpService: HttpService,
        private prismaService: PrismaService
    ) {}

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
                })).link : undefined;
            } catch (e) {
                console.error(e);
                await this.usersBaseService.deleteUserById(user.id);
                throw FileCreationException;
            }
        } else {
            profileData.photo = undefined;
        }

        await this.profilesBaseService.updateProfile(user.id, { photo: profileData.photo });
        return await this.usersBaseService.getUniqueUser({ id: user.id });
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


        const group = profile.groupId ? await this.groupsBaseService.getGroupById(profile.groupId, true) : null;
        const archive = await this.groupsArchivesBaseService.getArchivesByProfileId(profile.id);
        const isMain = group ? group.mainProfileId === profile.id : false;
        const partnerId = group?.[isMain ? 'secondProfileId' : 'mainProfileId'] ?? null;

        return {
            selfId: profile.id,
            partnerId: partnerId,
            selfStatus: getSelfStatusKey(archive, group),
            partnerStatus: getPartnerStatusKey(partnerId, group),
            isMainInGroup: isMain
        };
    }
}
