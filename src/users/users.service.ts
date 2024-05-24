import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {Prisma, Profile, User} from "@prisma/client";
import {PrismaService} from "../singles";
import {UserIncludes} from "../types";
import {FilesService} from "../files/files.service";
import {HttpService} from "@nestjs/axios";
import {FileCreationException} from "../errors";
import {ProfilesService} from "./profiles/profiles.service";


@Injectable()
export class UsersService {
    private include: (keyof Prisma.UserInclude)[] = ['profile', 'sessions'];

    constructor(
        private profilesService: ProfilesService,
        private prismaService: PrismaService,
        private httpService: HttpService,
        private filesService: FilesService
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
                await this.deleteUserById(user.id);
                throw FileCreationException;
            }
        } else {
            profileData.photo = undefined;
        }

        await this.profilesService.updateProfile(user.id, { photo: profileData.photo });
        return await this.getUniqueUser({ id: user.id });
    }
    updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prismaService.user.update({
            where: { id: userId },
            data
        });
    }

    async getUniqueUser<E extends boolean = false>(payload: Prisma.UserWhereUniqueInput, extend?: E) {
        return (await this.prismaService.user.findUnique({
            where: payload,
            include: {
                profile: extend,
                sessions: extend
            }
        })) as E extends true ? UserIncludes : User;
    }
    async getUser<E extends boolean = false>(payload: Prisma.UserWhereInput, extend?: E) {
        return (await this.prismaService.user.findFirst({
            where: payload,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? UserIncludes : User;
    }
    async getUsers<E extends boolean = false>(extend?: E) {
        return (await this.prismaService.user.findMany({
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? UserIncludes[] : User[];
    }

    async deleteUserById(userId: number): Promise<Profile> {
        return (await this.prismaService.user.delete({
            where: { id: userId },
            include: { profile: true }
        }))?.profile;
    }
}
