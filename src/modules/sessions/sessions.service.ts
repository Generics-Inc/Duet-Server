import * as bcrypt from "bcryptjs";
import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {Prisma, Session, User} from "@prisma/client";
import {SessionNotFoundException} from "@root/errors";
import {utils} from "@root/helpers";
import {PrismaService} from "@root/singles";
import {SessionIncludes} from "@root/types";
import {TokensDto} from "@modules/auth/dto";
import {DeviceDto} from "./dto";

@Injectable()
export class SessionsService {
    private include: (keyof Prisma.SessionInclude)[] = ['user'];
    private utils = utils();

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
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {}),
        })) as E extends true ? SessionIncludes[] : Session[];
    }

    cleanSessionData(session: Session, currentSession: Session) {
        delete session.accessToken;
        delete session.refreshToken;
        session.current = session.id === currentSession.id;
        return session
    }
    cleanSessionsData(sessions: Session[], currentSession: Session) {
        return sessions.map(session => this.cleanSessionData(session, currentSession));
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
        this.utils.ifEmptyGivesError(await this.getUniqueSession({ id: sessionId }), SessionNotFoundException);

        await this.prismaService.session.delete({
            where: {
                id: sessionId
            }
        });
    }
    async closeSessionsByArrayIds(userId: number, sessionsIds: number[]) {
        await this.prismaService.session.deleteMany({
            where: {
                id: { in: sessionsIds },
                userId
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
        return bcrypt.hashSync(data, 10);
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
