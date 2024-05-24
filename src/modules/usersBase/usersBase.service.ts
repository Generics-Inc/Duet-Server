import {Prisma, Profile, User} from "@prisma/client";
import {Injectable} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {UserIncludes} from "@root/types"
import {ProfilesBaseService} from "./profilesBase/profilesBase.service";


@Injectable()
export class UsersBaseService {
    private include: (keyof Prisma.UserInclude)[] = ['profile', 'sessions'];

    constructor(
        private profilesService: ProfilesBaseService,
        private prismaService: PrismaService
    ) {}

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
