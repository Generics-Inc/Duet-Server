import * as bcrypt from "bcryptjs";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import {Session} from "@prisma/client";
import {ExceptionGenerator} from "@root/errors";
import {utils} from "@root/helpers";
import {
    IncorrectPasswordException,
    SessionIsNotValidException,
    UserNotFoundException,
    VKGetUserException,
    VKSilentTokenException
} from "@root/errors";
import {UsersModelService} from "@models/users/users.service";
import {UsersProfilesService} from "@modules/users/profiles/profiles.service";
import {SessionsService} from "@modules/sessions/sessions.service";
import {SignInDto, TokensDto, VkSignInDto} from "./dto";
import {VkAccessInterface, VkUserInterface} from "./interfaces";
import {Response} from "express";
import {md5} from "@nestjs/throttler/dist/hash";


@Injectable()
export class AuthService {
    private utils = utils();

    constructor(
        private usersModelService: UsersModelService,
        private usersProfilesService: UsersProfilesService,
        private sessionsService: SessionsService,
        private configService: ConfigService,
        private httpService: HttpService
    ) {}

    async signIn(res: Response, data: SignInDto, ip: string): Promise<TokensDto> {
        const user = this.utils.ifEmptyGivesError(await this.usersModelService.getUserByUsername(data.user.username), UserNotFoundException);

        if (await bcrypt.compare(data.user.password, user.password)) {
            const { tokens, session } = await this.sessionsService.createSession(user, ip, data.device);
            res.cookie('passHash', md5(`${session.id}:${session.ip}`));
            return tokens;
        } else {
            throw IncorrectPasswordException;
        }
    }
    async vkSignIn(res: Response, payload: VkSignInDto, ip: string): Promise<TokensDto> {
        const vkToken = payload.vk.uuid ? await this.vkRequest<VkAccessInterface>('auth.exchangeSilentAuthToken', {
            access_token: this.configService.get<string>('VK_ACCESS_TOKEN', ''),
            ...payload
        }, VKSilentTokenException).then(r => r.access_token) : payload.vk.token;
        const vkUser = await this.vkRequest<VkUserInterface>('account.getProfileInfo', {
            access_token: vkToken
        }, VKGetUserException);

        let user = await this.usersModelService.getUserByUsername('ID' + vkUser.id);
        if (!user && vkUser.screen_name) user = await this.usersModelService.getUserByUsername(vkUser.screen_name);
        if (!user) {
            user = await this.usersProfilesService.createUser(
                {
                    username: vkUser.screen_name ?? 'ID' + vkUser.id,
                    role: 'USER'
                },
                {
                    vkId: vkUser.id,
                    gender: vkUser.sex === 1 ? 'FEMALE' : vkUser.sex === 2 ? 'MALE' : 'NOT_SPECIFIED',
                    firstName: vkUser.first_name,
                    lastName: vkUser.last_name,
                    birthday: this.formatDateString(vkUser.bdate),
                    status: vkUser.status,
                    photo: vkUser.photo_200
                }
            );
        }

        const { tokens, session } = await this.sessionsService.createSession(user, ip, payload.device);
        res.cookie('passHash', md5(`${session.id}:${session.ip}`));
        return tokens;
    }

    async refreshToken(session: Session, accessToken: string): Promise<TokensDto> {
        this.utils.ifEmptyGivesError(this.sessionsService.getBase().isTokenAlive(session, accessToken), SessionIsNotValidException);

        return await this.sessionsService.updateSessionById(session.id).then(res => res.tokens);
    }
    async logOut(sessionId: number): Promise<void> {
        try {
            await this.sessionsService.getBase().deleteSessionById(sessionId);
        } catch (e) {
            throw e;
        }
    }

    private async vkRequest<T>(endpoint: string, body: Object, ifNullThrow?: ExceptionGenerator) {
        const response = await this.httpService.axiosRef.get(`https://api.vk.com/method/${endpoint}`, {
            params: {
                v: '5.199',
                ...body
            }
        }).then((res: any) => res.data.response) as T;
        if (!response && ifNullThrow) throw ifNullThrow;

        return response;
    }
    private formatDateString(date: string): string {
        return date.split('.').map(component => component.length === 1 ? '0' + component : component).join('.');
    }
}
