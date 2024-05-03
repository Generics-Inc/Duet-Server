import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {Prisma, Profile, Role} from "@prisma/client";
import {PrismaService} from "../../prisma.service";
import {ProfileIncludes} from "../../types";
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
        const group = profile.groupId ? await this.groupsService.getGroupById(profile.groupId, true) : null;
        const archive = await this.groupsArchivesService.getArchivesByProfileId(profile.id);
        const isMain = group ? group.mainProfileId === profile.id : true;

        const selfStatus = GroupStatusSelf[group ? 'IN_GROUP' : archive.length ? 'NOT_IN_GROUP_WITH_ARCHIVE' : 'NOT_IN_GROUP'];
        const partnerStatus = GroupStatusPartner[group && group[isMain ? 'secondProfileId' : 'mainProfileId'] !== null ? 'IN_GROUP' : group && group.groupArchives.length ? 'GROUP_IN_ARCHIVE' : 'NO_PARTNER'];

        return {
            self: selfStatus,
            partner: partnerStatus
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
