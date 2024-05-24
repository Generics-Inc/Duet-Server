import {Request} from "express";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {SessionsService} from "@modules/sessions/sessions.service";
import {UsersService} from "@modules/users/users.service";
import {ProfilesService} from "@modules/users/profiles/profiles.service";
import {PayloadReturnDto, TokenPayloadDto} from "./dto";
import validate from './validate';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private configService: ConfigService,
        private sessionsService: SessionsService,
        private usersService: UsersService,
        private profilesService: ProfilesService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('REFRESH_SECRET', ''),
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: TokenPayloadDto): Promise<PayloadReturnDto> {
        return await validate('refresh', req, payload, this.sessionsService, this.usersService, this.profilesService);
    }
}
