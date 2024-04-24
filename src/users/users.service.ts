import {Injectable} from '@nestjs/common';
import {Prisma, Profile, User} from "@prisma/client";
import {PrismaService} from "../prisma.service";
import {UserIncludes} from "../types";


@Injectable()
export class UsersService {
    constructor(
        private prismaService: PrismaService
    ) {}

    createUser(
        userData: Omit<Prisma.UserCreateInput, 'profile' | 'sessions'>,
        profileData: Omit<Prisma.ProfileCreateWithoutUserInput, 'group' | 'groupsArchive'>
    ): Promise<User> {
        return this.prismaService.user.create({
            data: {
                ...userData,
                profile: {
                    create: profileData
                }
            }
        });
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
            include: {
                profile: extend,
                sessions: extend
            }
        })) as E extends true ? UserIncludes : User;
    }
    async getUsers<E extends boolean = false>(extend?: E) {
        return (await this.prismaService.user.findMany({
            include: {
                profile: extend,
                sessions: extend
            }
        })) as E extends true ? UserIncludes[] : User[];
    }

    async deleteUserById(userId: number): Promise<Profile> {
        return (await this.prismaService.user.delete({
            where: { id: userId },
            include: { profile: true }
        }))?.profile;
    }
}
