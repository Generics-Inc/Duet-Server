import {Injectable} from '@nestjs/common';
import {Prisma, Profile, Role, User} from "@prisma/client";
import {PrismaService} from "../../prisma.service";
import {ProfileIncludes, UserIncludes} from "../../types";
import {ProfileAccessDividedException} from "../../errors";


@Injectable()
export class ProfilesService {
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
                user: extend,
                group: extend,
                groupsArchive: extend
            }
        })) as E extends true ? ProfileIncludes : Profile;
    }
    async getProfiles<E extends boolean = false>(extend?: E) {
        return (await this.prismaService.profile.findMany({
            include: {
                user: extend,
                group: extend,
                groupsArchive: extend
            }
        })) as E extends true ? ProfileIncludes[] : Profile[];
    }

    async getProfileByIdHandler(reqProfileId: number, resProfileId: number) {
        const requester = await this.getProfile({ id: reqProfileId }, true);
        const requesterGroup = requester.groupId ? await this.prismaService.group.findUnique({
            where: { id: requester.groupId },
            include: {
                profiles: true,
                groupsArchive: true
            }
        }) : null;

        if (
            requester.user.role !== Role.ADMIN && (
                (!requester.group && reqProfileId !== resProfileId) ||
                (requester.group && ![...requesterGroup.profiles, ...requesterGroup.groupsArchive].some(profile => profile.id === resProfileId))
            )
        ) throw ProfileAccessDividedException;

        return this.getProfile({ id: resProfileId });
    }
}
