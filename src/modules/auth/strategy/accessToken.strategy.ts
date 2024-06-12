import {Request} from "express";
import {ExtractJwt, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {UsersProfilesModelService} from "@models/users/profiles/profiles.service";
import {SessionsModelService} from "@models/sessions/sessions.service";
import {UsersModelService} from "@models/users/users.service";
import {PayloadReturnDto, TokenPayloadDto} from "./dto";
import validate from './validate';
import {GroupsModelService} from "@models/groups/groups.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private configService: ConfigService,
        private sessionsModelService: SessionsModelService,
        private usersModelService: UsersModelService,
        private groupsModelService: GroupsModelService,
        private usersProfilesModelService: UsersProfilesModelService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('ACCESS_SECRET', ''),
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: TokenPayloadDto): Promise<PayloadReturnDto> {
        return await validate(
            'access',
            req,
            payload,
            this.sessionsModelService,
            this.usersModelService,
            this.groupsModelService,
            this.usersProfilesModelService
        );
    }
}
