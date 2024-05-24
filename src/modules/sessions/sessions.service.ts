import * as bcrypt from "bcryptjs";
import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {Session, User} from "@prisma/client";
import {SessionNotFoundException} from "@root/errors";
import {utils} from "@root/helpers";
import {PrismaService} from "@root/singles";
import {DeviceDto} from "@modules/sessionsBase/dto";
import {TokensDto} from "@modules/auth/dto";
import {SessionsBaseService} from "@modules/sessionsBase/sessionsBase.service";

@Injectable()
export class SessionsService {
    private utils = utils();

    constructor(
        private sessionsBaseService: SessionsBaseService,
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    getBase() {
        return this.sessionsBaseService;
    }

    async createSession(user: User, deviceMeta: DeviceDto) {
        let session = await this.sessionsBaseService.getSessionByIdAndUUID(user.id, deviceMeta.uuid);

        if (!session) session = await this.sessionsBaseService.createSession(user.id, deviceMeta);

        return await this.updateSessionById(session.id);
    }

    async updateSessionById(id: number) {
        const session = this.utils.ifEmptyGivesError(await this.sessionsBaseService.getSessionById(id), SessionNotFoundException);
        const tokens = await this.createTokens(session);

        return {
            session: await this.sessionsBaseService.updateSession(session.id, {
                accessToken: this.hashData(this.sessionsBaseService.getTokenSignature(tokens.accessToken)),
                refreshToken: this.hashData(this.sessionsBaseService.getTokenSignature(tokens.refreshToken)),
            }),
            tokens
        };
    }

    async getCleanedSessionByUserId(userId: number, currentSession: Session) {
        return this.cleanSessionsData(await this.sessionsBaseService.getSessionsByUserId(userId), currentSession);
    }

    async closeSession(id: number, userId: number) {
        this.utils.ifEmptyGivesError(await this.sessionsBaseService.getSessionByIdAndUserId(id, userId), SessionNotFoundException);
        await this.sessionsBaseService.deleteSessionsByListIdAndUserId([id], userId);
    }
    async closeSessions(ids: number[], userId: number) {
        await this.sessionsBaseService.deleteSessionsByListIdAndUserId(ids, userId);
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

    cleanSessionData(session: Session, currentSession: Session) {
        delete session.accessToken;
        delete session.refreshToken;
        session.current = session.id === currentSession.id;
        return session
    }
    cleanSessionsData(sessions: Session[], currentSession: Session) {
        return sessions.map(session => this.cleanSessionData(session, currentSession));
    }
}
