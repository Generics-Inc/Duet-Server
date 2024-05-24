import {Injectable} from '@nestjs/common';
import {Prisma, Profile} from "@prisma/client";
import {ProfileAccessDividedException} from "@root/errors";
import {AccessToEntity} from "@root/helpers";
import {PrismaService} from "@root/singles";
import {ProfileIncludes} from "@root/types";


@Injectable()
export class ProfilesBaseService {
    private includeWithDelete: (keyof Prisma.ProfileInclude)[] = ['mainGroup', 'secondGroup'];
    private include: (keyof Prisma.ProfileInclude)[] = ['user', 'groupsArchives', 'groupsRequests', 'mainGroup', 'secondGroup'];

    constructor(private prismaService: PrismaService) {}

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

    async getProfileByIdHandler(reqProfileId: number, resProfileId: number) {
        if (await AccessToEntity.accessToProfile(this.prismaService, reqProfileId, resProfileId)) throw ProfileAccessDividedException;

        return this.getProfile({ id: resProfileId });
    }
}
