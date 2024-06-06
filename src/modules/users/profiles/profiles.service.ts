import {Prisma} from "@prisma/client";
import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {AccessToEntity} from "@root/helpers";
import {FileCreationException, ProfileAccessDividedException} from "@root/errors";
import {GroupsArchivesModelService} from "@models/groups/archives/archives.service";
import {UsersProfilesModelService} from "@models/users/profiles/profiles.service";
import {GroupsModelService} from "@models/groups/groups.service";
import {UsersModelService} from "@models/users/users.service";
import {PrismaService} from "@modules/prisma/prisma.service";
import {FilesService} from "@modules/files/files.service";
import {GroupStatusDto, GroupStatusPartner, GroupStatusSelf, ProfileIdDto} from "./dto";
import {ProfileDto} from "@models/users/profiles/dto";
import {GroupArchiveDto} from "@models/groups/archives/dto";
import {GroupDto} from "@models/groups/dto";


@Injectable()
export class UsersProfilesService {
    constructor(
        private modelService: UsersProfilesModelService,
        private groupsModelService: GroupsModelService,
        private groupsArchivesModelService: GroupsArchivesModelService,
        private usersModelService: UsersModelService,
        private filesService: FilesService,
        private httpService: HttpService,
        private prismaService: PrismaService
    ) {}

    getModel() {
        return this.modelService;
    }

    async createUser(
        userData: Omit<Prisma.UserCreateInput, 'profile' | 'sessions'>,
        profileData: Omit<Prisma.ProfileCreateWithoutUserInput, 'group' | 'groupsArchive'>
    ) {
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
                await this.usersModelService.deleteModelById(user.id);
                throw FileCreationException;
            }
        } else {
            profileData.photo = undefined;
        }

        await this.modelService.update(user.id, { photo: profileData.photo });
        return this.usersModelService.getModelById(user.id);
    }

    async statusAboutProfile(profile: ProfileDto): Promise<GroupStatusDto> {
        const getSelfStatusKey = (archive: GroupArchiveDto[], group?: GroupDto): GroupStatusSelf => {
            if (group) return GroupStatusSelf.IN_GROUP;
            else if (archive.length) return GroupStatusSelf.NOT_IN_GROUP_WITH_ARCHIVE;
            else return GroupStatusSelf.NOT_IN_GROUP;
        };
        const getPartnerStatusKey = (partnerId?: number, group?: GroupDto): GroupStatusPartner => {
            if (!group) return GroupStatusPartner.NO_PARTNER;
            else if (partnerId !== null) return GroupStatusPartner.IN_GROUP;
            else if (group.groupArchives.length) return GroupStatusPartner.GROUP_IN_ARCHIVE;
            else if (!group.inviteCode) return GroupStatusPartner.LEAVED;
            else return GroupStatusPartner.NO_PARTNER;
        };


        const group = profile.groupId ? await this.groupsModelService.getById(profile.groupId) : null;
        const archive = await this.groupsArchivesModelService.getManyByProfileId(profile.id);
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
        if (await AccessToEntity.accessToProfile(this.modelService, this.groupsModelService, reqProfileId, resProfileId).then(r => !r.status))
            throw ProfileAccessDividedException;

        const profile = await this.modelService.getById(resProfileId);
        const status = await this.statusAboutProfile(profile);
        const group = profile.groupId ? await this.groupsModelService.getModelById(profile.groupId) : null;
        const partner = status.partnerId ? await this.modelService.getMinimalById(status.partnerId) : null;

        return {
            ...profile,
            group,
            partner,
            status
        };
    }
}
