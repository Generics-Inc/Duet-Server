import {Injectable} from '@nestjs/common';
import {Prisma} from "@prisma/client";
import {PrismaService} from "@modules/prisma/prisma.service";
import {ProfileFullPConfig, ProfileMinimalPConfig, ProfilePConfig} from "./config";
import {ProfileDto, ProfileFullDto, ProfileMinimalDto} from "./dto";


@Injectable()
export class UsersProfilesModelService {
    private repo: Prisma.ProfileDelegate;

    constructor(prismaService: PrismaService) {
        this.repo = prismaService.profile;
    }

    async update(id: number, data: Prisma.ProfileUpdateInput): Promise<ProfileDto> {
        return this.repo.update({
            where: { id },
            data,
            select: ProfilePConfig
        }).then(this.prepareProfile);
    }

    async getById(id: number): Promise<ProfileDto> {
        return this.repo.findUnique({
            where: { id },
            select: ProfilePConfig
        }).then(this.prepareProfile);
    }
    async getFullById(id: number): Promise<ProfileFullDto> {
        return this.repo.findUnique({
            where: { id },
            select: ProfileFullPConfig
        }).then(this.prepareProfile);
    }
    getMinimalById(id: number): Promise<ProfileMinimalDto> {
        return this.repo.findUnique({
            where: { id },
            select: ProfileMinimalPConfig
        });
    }

    private prepareProfile(profile: any) {
        if (!profile) return profile;
        profile.group = profile.mainGroup ?? profile.secondGroup ?? null;
        profile.groupId = profile.group?.id ?? null;
        delete profile.mainGroup;
        delete profile.secondGroup;
        return profile;
    }
}
