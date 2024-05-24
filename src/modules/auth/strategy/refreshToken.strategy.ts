import {Request} from "express";
import {ExtractJwt, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ProfilesBaseService} from "@modules/usersBase/profilesBase/profilesBase.service";
import {UsersBaseService} from "@modules/usersBase/usersBase.service";
import {SessionsService} from "@modules/sessions/sessions.service";
import {PayloadReturnDto, TokenPayloadDto} from "./dto";
import validate from './validate';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private configService: ConfigService,
        private sessionsService: SessionsService,
        private usersService: UsersBaseService,
        private profilesService: ProfilesBaseService
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
