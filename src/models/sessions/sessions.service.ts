import * as bcrypt from "bcryptjs";
import {Injectable} from '@nestjs/common';
import {Prisma, PrismaPromise} from "@prisma/client";
import {PrismaService} from "@modules/prisma/prisma.service";
import {DeviceDto, SessionMinimalDto, SessionModelDto} from "./dto";
import {SessionMinimalPConfig, SessionModelPConfig} from "@models/sessions/config";

@Injectable()
export class SessionsModelService {
    private repo: Prisma.SessionDelegate;

    constructor(prismaService: PrismaService) {
        this.repo = prismaService.session;
    }

    isTokenAlive(session: SessionModelDto, access?: string, refresh?: string): boolean {
        let resultStatus = true;

        if (access && !bcrypt.compareSync(this.getTokenSignature(access), session.accessToken)) resultStatus = false;
        if (refresh && !bcrypt.compareSync(this.getTokenSignature(refresh), session.refreshToken)) resultStatus = false;

        return resultStatus;
    }

    createModel(userId: number, accountId: number, ip: string, device: DeviceDto): PrismaPromise<SessionModelDto> {
        return this.repo.create({
            data: {
                user: { connect: { id: userId } },
                account: { connect: { id: accountId } },
                ip: ip,
                deviceUUID: device.uuid,
                deviceName: device.name,
                deviceOS: device.os
            },
            select: SessionModelPConfig
        });
    }

    updateModel(id: number, data: Prisma.SessionUpdateInput): PrismaPromise<SessionModelDto> {
        return this.repo.update({
            where: { id },
            data,
            select: SessionModelPConfig
        });
    }
    updateModelLastActivityById(id: number): PrismaPromise<SessionModelDto> {
        return this.updateModel(id, {
            lastActivityAt: new Date()
        });
    }

    getModelById(id: number): PrismaPromise<SessionModelDto> {
        return this.repo.findUnique({
            where: { id },
            select: SessionModelPConfig
        });
    }
    getMinimalByIdAndUserId(id: number, userId: number): PrismaPromise<SessionMinimalDto> {
        return this.repo.findUnique({
            where: { id, userId },
            select: SessionMinimalPConfig
        });
    }
    getMinimalById(id: number): PrismaPromise<SessionMinimalDto> {
        return this.repo.findUnique({
            where: { id },
            select: SessionMinimalPConfig
        });
    }
    getMinimalByUserIdAndDeviceUUID(userId: number, deviceUUID: string): PrismaPromise<SessionMinimalDto> {
        return this.repo.findUnique({
            where: { userId_deviceUUID: { userId, deviceUUID } },
            select: SessionMinimalPConfig
        });
    }

    getManyMinimalByUserId(userId: number): PrismaPromise<SessionMinimalDto[]> {
        return this.repo.findMany({
            where: { userId },
            select: SessionMinimalPConfig
        });
    }

    deleteMinimalById(id: number): PrismaPromise<SessionMinimalDto> {
        return this.repo.delete({
            where: { id },
            select: SessionMinimalPConfig
        });
    }
    deleteManyMinimalByListIdAndUserId(ids: number[], userId: number): PrismaPromise<Prisma.BatchPayload> {
        return this.repo.deleteMany({
            where: { id: { in: ids }, userId }
        });
    }

    getTokenSignature(token: string): string {
        return token.split('.').pop();
    }
}
