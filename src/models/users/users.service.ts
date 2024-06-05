import {Prisma, Profile, User} from "@prisma/client";
import {Injectable} from '@nestjs/common';
import {UserIncludes} from "@root/types"
import {PrismaService} from "@modules/prisma/prisma.service";


@Injectable()
export class UsersModelService {
    private include: (keyof Prisma.UserInclude)[] = ['profile', 'sessions'];

    constructor(private prismaService: PrismaService) {}

    updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prismaService.user.update({
            where: { id: userId },
            data
        });
    }

    getUserById<E extends boolean = false>(id: number, extend?: E) {
        return this.getUniqueUser<E>({ id }, extend);
    }
    getUserByUsername<E extends boolean = false>(username: string, extend?: E) {
        return this.getUniqueUser<E>({ username }, extend);
    }

    async deleteUserById(userId: number): Promise<Profile> {
        return (await this.prismaService.user.delete({
            where: { id: userId },
            include: { profile: true }
        }))?.profile;
    }

    private async getUser<E extends boolean = false>(where: Prisma.UserWhereInput, extend?: E) {
        return (await this.prismaService.user.findFirst({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? UserIncludes : User;
    }
    private async getUniqueUser<E extends boolean = false>(where: Prisma.UserWhereUniqueInput, extend?: E) {
        return (await this.prismaService.user.findUnique({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? UserIncludes : User;
    }
    private async getUsers<E extends boolean = false>(where: Prisma.UserWhereInput, extend?: E) {
        return (await this.prismaService.user.findMany({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? UserIncludes[] : User[];
    }
}
