import * as bcrypt from "bcryptjs";
import {ConfigService} from "@nestjs/config";
import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {SessionNotFoundException} from "@root/errors";
import {utils} from "@root/helpers";
import {SessionsModelService} from "@models/sessions/sessions.service";
import {DeviceDto, SessionMinimalDto, SessionModelDto} from "@models/sessions/dto";
import {TokensDto} from "@modules/auth/dto";
import {UserModelDto} from "@models/users/dto";

@Injectable()
export class SessionsService {
    private utils = utils();

    constructor(
        private modelService: SessionsModelService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    getModel() {
        return this.modelService;
    }

    async createSession(user: UserModelDto, ip: string, device: DeviceDto) {
        let session = await this.modelService.getMinimalByUserIdAndDeviceUUID(user.id, device.uuid);

        if (!session) session = await this.modelService.createModel(user.id, ip, device);

        return await this.updateSessionById(session.id, ip);
    }

    async updateSessionById(id: number, ip?: string) {
        const session = this.utils.ifEmptyGivesError(await this.modelService.getMinimalById(id), SessionNotFoundException);
        const tokens = await this.createTokens(session);

        return {
            session: await this.modelService.updateModel(session.id, {
                ip,
                accessToken: this.hashData(this.modelService.getTokenSignature(tokens.accessToken)),
                refreshToken: this.hashData(this.modelService.getTokenSignature(tokens.refreshToken)),
            }),
            tokens
        };
    }

    async closeSession(id: number, userId: number) {
        this.utils.ifEmptyGivesError(await this.modelService.getMinimalByIdAndUserId(id, userId), SessionNotFoundException);
        await this.modelService.deleteManyMinimalByListIdAndUserId([id], userId);
    }
    async closeSessions(ids: number[], userId: number) {
        await this.modelService.deleteManyMinimalByListIdAndUserId(ids, userId);
    }

    async prepareSessionDataById(id: number, currentSession: SessionMinimalDto) {
        const session = await this.modelService.getMinimalById(id);
        return this.prepareSessionData(session, currentSession);
    }
    async prepareSessionsDataByUserId(userId: number, currentSession: SessionMinimalDto) {
        const sessions = await this.modelService.getManyMinimalByUserId(userId);
        return sessions.map(session => this.prepareSessionData(session, currentSession));
    }

    private async createTokens(session: SessionModelDto): Promise<TokensDto> {
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
    private hashData(data: string): string {
        return bcrypt.hashSync(data, 10);
    }
    private prepareSessionData(session: SessionMinimalDto, currentSession: SessionMinimalDto) {
        session.current = session.id === currentSession.id;
        return session;
    }
}
