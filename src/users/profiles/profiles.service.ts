import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {GroupArchive, Prisma, Profile, Role} from "@prisma/client";
import {PrismaService} from "../../singles";
import {GroupIncludes, ProfileIncludes} from "../../types";
import {ProfileAccessDividedException} from "../../errors";
import {GroupsService} from "../../groups/groups.service";
import {GroupsArchivesService} from "../../groups/archives/archives.service";
import {GroupStatusDto, GroupStatusPartner, GroupStatusSelf} from "./dto";
import {accessToProfile} from "../../helpers";


@Injectable()
export class ProfilesService {
    private includeWithDelete: (keyof Prisma.ProfileInclude)[] = ['mainGroup', 'secondGroup'];
    private include: (keyof Prisma.ProfileInclude)[] = ['user', 'groupsArchives', 'groupsRequests', 'mainGroup', 'secondGroup'];

    constructor(
        private prismaService: PrismaService,
        @Inject(forwardRef(() => GroupsService))
        private groupsService: GroupsService,
        @Inject(forwardRef(() => GroupsArchivesService))
        private groupsArchivesService: GroupsArchivesService,
    ) {}

    updateProfile(profileId: number, data: Prisma.ProfileUpdateInput): Promise<Profile> {
        return this.prismaService.profile.update({
            where: { id: profileId },
            data
        });
    }

    async getProfileById<E extends boolean = false>(id: number, extend?: E) {
        return this.getProfile({ id }, extend);
    }
    async getProfile<E extends boolean = false>(payload: Prisma.ProfileWhereUniqueInput, extend?: E) {
        return (await this.prismaService.profile.findUnique({
            where: payload,
            include: {
                ...this.include.reduce((a, c) => { a[c] = extend; return a; }, {}),
                ...this.includeWithDelete.reduce((a, c) => { a[c] = true; return a; }, {})
            }
        }).then((profile: ProfileIncludes) => {
            if (!profile) return profile;
            profile.groupId = profile.mainGroup?.id ?? profile.secondGroup?.id ?? null;
            if (!extend) this.includeWithDelete.map(k => delete profile[k]);
            return profile;
        })) as E extends true ? ProfileIncludes : Profile;
    }
    async getProfiles<E extends boolean = false>(extend?: E) {
        return (await this.prismaService.profile.findMany({
            include: {
                ...this.include.reduce((a, c) => { a[c] = extend; return a; }, {}),
                ...this.includeWithDelete.reduce((a, c) => { a[c] = true; return a; }, {})
            }
        }).then(profiles => profiles.map((profile: ProfileIncludes) => {
            profile.groupId = profile.mainGroup?.id ?? profile.secondGroup?.id ?? null;
            if (!extend) this.includeWithDelete.map(k => delete profile[k]);
            return profile;
        }))) as E extends true ? ProfileIncludes[] : Profile[];
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


        const group = profile.groupId ? await this.groupsService.getGroupById(profile.groupId, true) : null;
        const archive = await this.groupsArchivesService.getArchivesByProfileId(profile.id);
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
    async getProfileByIdHandler(reqProfileId: number, resProfileId: number) {
        if (await accessToProfile(this.prismaService, reqProfileId, resProfileId)) throw ProfileAccessDividedException;

        return this.getProfile({ id: resProfileId });
    }
}
