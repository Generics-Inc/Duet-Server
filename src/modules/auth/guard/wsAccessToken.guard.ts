import {CanActivate, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {Socket} from 'socket.io';
import {ExecutionContextHost} from "@nestjs/core/helpers/execution-context-host";
import {TokenPayloadDto} from "@modules/auth/strategy/dto";
import {UsersModelService} from "@models/users/users.service";
import {WsSessionException} from "@root/errors";
import {SessionsModelService} from "@models/sessions/sessions.service";
import validate from "@modules/auth/strategy/validate";
import {GroupsModelService} from "@models/groups/groups.service";
import {UsersProfilesModelService} from "@models/users/profiles/profiles.service";


@Injectable()
export class WsGuardAccessToken implements CanActivate {
    constructor(
        private usersModelService: UsersModelService,
        private sessionsModelService: SessionsModelService,
        private groupsModelService: GroupsModelService,
        private usersProfilesModelService: UsersProfilesModelService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContextHost): Promise<boolean> {
        const socket = context.getArgs()[0] as Socket;
        const token = socket.handshake.headers?.authorization;
        const bearerToken = (token ?? socket.handshake.auth?.token)?.split(' ')[1];

        try {
            const request = context.switchToHttp().getRequest();
            const payload = this.jwtService.verify(bearerToken, {
                secret: this.configService.get('SECRET', '')
            }) as TokenPayloadDto;

            const authData = validate(
                bearerToken,
                'access',
                request,
                payload,
                this.sessionsModelService,
                this.usersModelService,
                this.groupsModelService,
                this.usersProfilesModelService
            );
            await this.sessionsModelService.updateModelLastActivityById(payload.sessionId);

            request.user = authData;
            request.authUserSocket = socket;
        } catch (e) {
            throwSessionException(socket);
        }

        return true;
    }
}

function throwSessionException(socket: Socket) {
    WsSessionException(socket);
    return false;
}
