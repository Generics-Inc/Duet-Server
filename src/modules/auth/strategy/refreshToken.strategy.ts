import {Request} from "express";
import {ExtractJwt, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {UsersProfilesBaseService} from "@modules/usersBase/profilesBase/profilesBase.service";
import {SessionsBaseService} from "@modules/sessionsBase/sessionsBase.service";
import {UsersBaseService} from "@modules/usersBase/usersBase.service";
import {PayloadReturnDto, TokenPayloadDto} from "./dto";
import validate from './validate';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private configService: ConfigService,
        private sessionsBaseService: SessionsBaseService,
        private usersBaseService: UsersBaseService,
        private usersProfilesBaseService: UsersProfilesBaseService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('REFRESH_SECRET', ''),
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: TokenPayloadDto): Promise<PayloadReturnDto> {
        return await validate('refresh', req, payload, this.sessionsBaseService, this.usersBaseService, this.usersProfilesBaseService);
    }
}
