import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {GroupArchive, Prisma, Profile, Role} from "@prisma/client";
import {PrismaService} from "../../singles";
import {GroupIncludes, ProfileIncludes} from "../../types";
import {ProfileAccessDividedException} from "../../errors";
import {GroupsService} from "../../groups/groups.service";
import {GroupsArchivesService} from "../../groups/archives/archives.service";
import {GroupStatusDto, GroupStatusPartner, GroupStatusSelf} from "./dto";


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
        const getPartnerStatusKey = (group?: GroupIncludes): GroupStatusPartner => {
            const isMain = group ? group.mainProfileId === profile.id : true;

            if (!group) return GroupStatusPartner.NO_PARTNER;
            else if (group[isMain ? 'secondProfileId' : 'mainProfileId'] !== null) return GroupStatusPartner.IN_GROUP;
            else if (group.groupArchives.length) return GroupStatusPartner.GROUP_IN_ARCHIVE;
            else if (!group.inviteCode) return GroupStatusPartner.LEAVED;
            else return GroupStatusPartner.NO_PARTNER;
        };

        const group = profile.groupId ? await this.groupsService.getGroupById(profile.groupId, true) : null;
        const archive = await this.groupsArchivesService.getArchivesByProfileId(profile.id);

        return {
            self: getSelfStatusKey(archive, group),
            partner: getPartnerStatusKey(group)
        };
    }
    async getProfileByIdHandler(reqProfileId: number, resProfileId: number) {
        const requester = await this.getProfile({ id: reqProfileId }, true);
        const requesterGroup = requester.groupId ? await this.groupsService.getGroupById(requester.groupId, true) : null;

        if (
            requester.user.role !== Role.ADMIN && (
                reqProfileId !== resProfileId && (
                    !requesterGroup || ![
                        ...requesterGroup.groupArchives.map(r => r.profileId),
                        requesterGroup.mainProfileId,
                        requesterGroup.secondProfileId
                    ].includes(resProfileId)
                )
            )
        ) throw ProfileAccessDividedException;

        return this.getProfile({ id: resProfileId });
    }
}
