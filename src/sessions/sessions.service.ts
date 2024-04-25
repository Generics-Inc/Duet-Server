import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {SessionIncludes} from "../types";
import {Prisma, Session, User} from "@prisma/client";
import {DeviceDto} from "./dto";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import useUtils from "../composables/useUtils";
import {SessionNotFoundException} from "../errors";
import * as bcrypt from "bcryptjs";
import {TokensDto} from "../auth/dto";

@Injectable()
export class SessionsService {
    private utils = useUtils();

    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async getUniqueSession<E extends boolean = false>(where: Prisma.SessionWhereUniqueInput, extend?: E) {
        return (await this.prismaService.session.findUnique({
            where: where,
            include: {
                user: extend
            }
        })) as E extends true ? SessionIncludes : Session;
    }
    async getSession<E extends boolean = false>(where: Prisma.SessionWhereInput, extend?: E) {
        return (await this.prismaService.session.findFirst({
            where: where,
            include: {
                user: extend
            }
        })) as E extends true ? SessionIncludes : Session;
    }
    async getSessions<E extends boolean = false>(where?: Prisma.SessionWhereInput, extend?: E) {
        return (await this.prismaService.session.findMany({
            where: where,
            include: {
                user: extend
            }
        })) as E extends true ? SessionIncludes[] : Session[];
    }

    async createSession(user: User, deviceMeta: DeviceDto) {
        let session = await this.getSession({
            userId: user.id,
            deviceUUID: deviceMeta.uuid
        });

        if (!session) {
            session = await this.prismaService.session.create({
                data: {
                    user: { connect: { id: user.id } },
                    deviceUUID: deviceMeta.uuid,
                    deviceName: deviceMeta.name,
                    deviceOS: deviceMeta.os,
                }
            });
        }

        return await this.updateSession(session.id);
    }
    async updateSession(sessionId: number) {
        const session = this.utils.ifEmptyGivesError(await this.getUniqueSession({ id: sessionId }), SessionNotFoundException);
        const tokens = await this.createTokens(session);

        return {
            session: await this.prismaService.session.update({
                where: { id: session.id },
                data: {
                    accessToken: this.hashData(this.getTokenSignature(tokens.accessToken)),
                    refreshToken: this.hashData(this.getTokenSignature(tokens.refreshToken)),
                }
            }),
            tokens
        };
    }
    async updateSessionLastActivity(sessionId: number) {
        return this.prismaService.session.update({
            where: { id: sessionId },
            data: { lastActivityAt: new Date() }
        });
    }
    async closeSession(sessionId: number) {
        console.log(sessionId)
        this.utils.ifEmptyGivesError(await this.getUniqueSession({ id: sessionId }), SessionNotFoundException);

        await this.prismaService.session.delete({
            where: {
                id: sessionId
            }
        });
    }

    tokenLifeCheck(session: Session, access?: string, refresh?: string): boolean {
        let resultStatus = true;

        if (access && !bcrypt.compareSync(this.getTokenSignature(access), session.accessToken)) resultStatus = false;
        if (refresh && !bcrypt.compareSync(this.getTokenSignature(refresh), session.refreshToken)) resultStatus = false;

        return resultStatus;
    }

    private getTokenSignature(token: string): string {
        return token.split('.').pop();
    }
    private hashData(data: string): string {
        return bcrypt.hashSync(data, 12);
    }
    private async createTokens(session: Session): Promise<TokensDto> {
        const payload = {
            userId: session.userId,
            sessionId: session.id
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('ACCESS_SECRET', ''),
                expiresIn: '3d'
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('REFRESH_SECRET', ''),
                expiresIn: '14d'
            })
        ])

        return { accessToken, refreshToken };
    }
}
