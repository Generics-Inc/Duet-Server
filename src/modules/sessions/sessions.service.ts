import * as bcrypt from "bcryptjs";
import {ConfigService} from "@nestjs/config";
import {HttpService} from "@nestjs/axios";
import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {Prisma, Session, User} from "@prisma/client";
import {SessionNotFoundException} from "@root/errors";
import {PrismaService} from "@root/singles";
import {utils} from "@root/helpers";
import {SessionsModelService} from "@models/sessions/sessions.service";
import {DeviceDto, LocationDto} from "@models/sessions/dto";
import {TokensDto} from "@modules/auth/dto";

@Injectable()
export class SessionsService {
    private utils = utils();

    constructor(
        private sessionsModelService: SessionsModelService,
        private prismaService: PrismaService,
        private httpService: HttpService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    getBase() {
        return this.sessionsModelService;
    }

    async createSession(user: User, ip: string, device: DeviceDto) {
        let session = await this.sessionsModelService.getSessionByUserIdAndUUID(user.id, device.uuid);

        const location = (session?.ip === ip ? session.location : await this.getLocationByIP(ip)) as LocationDto;
        if (!session) session = await this.sessionsModelService.createSession(user.id, ip, device, location);

        return await this.updateSessionById(session.id, ip, location);
    }

    async updateSessionById(id: number, ip?: string, location?: LocationDto) {
        const session = this.utils.ifEmptyGivesError(await this.sessionsModelService.getSessionById(id), SessionNotFoundException);
        const tokens = await this.createTokens(session);

        return {
            session: await this.sessionsModelService.updateSession(session.id, {
                ...(ip ? { ip, location: location as unknown as Prisma.JsonValue } : {}),
                accessToken: this.hashData(this.sessionsModelService.getTokenSignature(tokens.accessToken)),
                refreshToken: this.hashData(this.sessionsModelService.getTokenSignature(tokens.refreshToken)),
            }),
            tokens
        };
    }

    async getCleanedSessionById(id: number, currentSession: Session) {
        return this.cleanSessionData(await this.sessionsModelService.getSessionById(id), currentSession);
    }
    async getCleanedSessionsByUserId(userId: number, currentSession: Session) {
        return this.cleanSessionsData(await this.sessionsModelService.getSessionsByUserId(userId), currentSession);
    }

    async closeSession(id: number, userId: number) {
        this.utils.ifEmptyGivesError(await this.sessionsModelService.getSessionByIdAndUserId(id, userId), SessionNotFoundException);
        await this.sessionsModelService.deleteSessionsByListIdAndUserId([id], userId);
    }
    async closeSessions(ids: number[], userId: number) {
        await this.sessionsModelService.deleteSessionsByListIdAndUserId(ids, userId);
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
    private async getLocationByIP(ip: string) {
        if(!/^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/.test(ip))
            return null;

        try {
            const location = await this.httpService.axiosRef.get<LocationDto>(`http://ip-api.com/json/${ip}?fields=45859839&lang=ru`);
            if (location.data?.status !== 'success') return null;
            return location.data;
        } catch(_) {
            return null;
        }
    }
}
