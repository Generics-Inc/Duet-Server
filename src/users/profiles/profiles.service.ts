import {Injectable} from '@nestjs/common';
import {Prisma, Profile, Role} from "@prisma/client";
import {PrismaService} from "../../prisma.service";
import {ProfileIncludes} from "../../types";
import {ProfileAccessDividedException} from "../../errors";


@Injectable()
export class ProfilesService {
    private includeWithDelete: (keyof Prisma.ProfileInclude)[] = ['mainGroup', 'secondGroup'];
    private include: (keyof Prisma.ProfileInclude)[] = ['user', 'groupsArchives', 'groupsRequests', 'mainGroup', 'secondGroup'];

    constructor(
        private prismaService: PrismaService
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

    async getProfileByIdHandler(reqProfileId: number, resProfileId: number) {
        const requester = await this.getProfile({ id: reqProfileId }, true);
        const requesterGroup = requester.groupId ? await this.prismaService.group.findUnique({
            where: { id: requester.groupId },
            include: {
                groupArchives: true
            }
        }) : null;

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
