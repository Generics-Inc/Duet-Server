import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {PayloadReturnDto, TokenPayloadDto} from "./dto/payload.dto";
import {Injectable} from "@nestjs/common";
import {UsersService} from "../../users/users.service";
import {ConfigService} from "@nestjs/config";
import {Request} from "express";
import validate from './validate';
import {ProfilesService} from "../../users/profiles/profiles.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
        private profilesService: ProfilesService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('ACCESS_SECRET', ''),
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: TokenPayloadDto): Promise<PayloadReturnDto> {
        return await validate(req, payload, this.usersService, this.profilesService);
    }
}
