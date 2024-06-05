import {Injectable} from '@nestjs/common';
import {Prisma, Profile} from "@prisma/client";
import {ProfileIncludes} from "@root/types";
import {PrismaService} from "@modules/prisma/prisma.service";


@Injectable()
export class UsersProfilesModelService {
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
        return this.getUniqueProfile({ id }, extend);
    }

    private async getProfile<E extends boolean = false>(where: Prisma.ProfileWhereInput, extend?: E) {
        return (await this.prismaService.profile.findFirst({
            where,
            include: {
                ...this.include.reduce((a, c) => { a[c] = extend; return a; }, {}),
                ...this.includeWithDelete.reduce((a, c) => { a[c] = true; return a; }, {})
            }
        }).then(this.prepareProfile.bind(this, extend))) as E extends true ? ProfileIncludes : Profile;
    }
    private async getUniqueProfile<E extends boolean = false>(where: Prisma.ProfileWhereUniqueInput, extend?: E) {
        return (await this.prismaService.profile.findUnique({
            where,
            include: {
                ...this.include.reduce((a, c) => { a[c] = extend; return a; }, {}),
                ...this.includeWithDelete.reduce((a, c) => { a[c] = true; return a; }, {})
            }
        }).then(this.prepareProfile.bind(this, extend))) as E extends true ? ProfileIncludes : Profile;
    }
    private async getProfiles<E extends boolean = false>(where?: Prisma.ProfileWhereInput, extend?: E) {
        return (await this.prismaService.profile.findMany({
            where,
            include: {
                ...this.include.reduce((a, c) => { a[c] = extend; return a; }, {}),
                ...this.includeWithDelete.reduce((a, c) => { a[c] = true; return a; }, {})
            }
        }).then(profiles => profiles.map(this.prepareProfile.bind(this, extend)))) as E extends true ? ProfileIncludes[] : Profile[];
    }

    private prepareProfile(extend: boolean, profile: ProfileIncludes) {
        if (!profile) return profile;
        profile.groupId = profile.mainGroup?.id ?? profile.secondGroup?.id ?? null;
        if (!extend) this.includeWithDelete.map(k => delete profile[k]);
        return profile;
    }
}
