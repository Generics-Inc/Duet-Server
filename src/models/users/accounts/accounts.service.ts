import {Injectable} from '@nestjs/common';
import {AccountType, Prisma} from "@prisma/client";
import {PrismaService} from "@modules/prisma/prisma.service";
import {AccountModelDto} from "./dto";
import {AccountModelPConfig} from "./config";


@Injectable()
export class UsersAccountsModelService {
    private repo: Prisma.ConnectedAccountDelegate;

    constructor(prismaService: PrismaService) {
        this.repo = prismaService.connectedAccount;
    }

    getModalById(id: number): Promise<AccountModelDto> {
        return this.repo.findUnique({
            where: { id },
            select: AccountModelPConfig
        });
    }
    getModalByUserIdAndType(userId: number, type: AccountType): Promise<AccountModelDto> {
        return this.repo.findUnique({
            where: { userId_type: { userId, type } },
            select: AccountModelPConfig
        });
    }

    getManyModalByUserId(userId: number): Promise<AccountModelDto[]> {
        return this.repo.findMany({
            where: { userId },
            select: AccountModelPConfig
        });
    }
}
