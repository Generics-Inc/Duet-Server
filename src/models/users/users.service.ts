import {Prisma, PrismaPromise} from "@prisma/client";
import {Injectable} from '@nestjs/common';
import {PrismaService} from "@modules/prisma/prisma.service";
import {UserModelDto} from "@models/users/dto";
import {UserModelPConfig} from "@models/users/config/userModel.config";


@Injectable()
export class UsersModelService {
    private repo: Prisma.UserDelegate;

    constructor(prismaService: PrismaService) {
        this.repo = prismaService.user;
    }

    updateModel(userId: number, data: Prisma.UserUpdateInput): PrismaPromise<UserModelDto> {
        return this.repo.update({
            where: { id: userId },
            data,
            select: UserModelPConfig
        });
    }

    getModelById(id: number): PrismaPromise<UserModelDto> {
        return this.repo.findUnique({
            where: { id },
            select: UserModelPConfig
        });
    }
    getModelByUsername(username: string): PrismaPromise<UserModelDto> {
        return this.repo.findUnique({
            where: { username },
            select: UserModelPConfig
        });
    }

    deleteModelById(userId: number): PrismaPromise<UserModelDto> {
        return this.repo.delete({
            where: { id: userId },
            select: UserModelPConfig
        });
    }
}
