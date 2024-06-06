import * as bcrypt from "bcryptjs";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import {Session} from "@prisma/client";
import {AuthorizedAccountNotFoundException, ExceptionGenerator} from "@root/errors";
import {utils} from "@root/helpers";
import {
    IncorrectPasswordException,
    SessionIsNotValidException,
    UserNotFoundException,
    VKGetUserException,
    VKSilentTokenException
} from "@root/errors";
import {SessionsService} from "@modules/sessions/sessions.service";
import {SignInDto, TokensDto, VkSignInDto} from "./dto";
import {VkAccessInterface, VkUserInterface} from "./interfaces";
import {Response} from "express";
import {md5} from "@nestjs/throttler/dist/hash";
import {UsersService} from "@modules/users/users.service";
import {UsersAccountsService} from "@modules/users/accounts/accounts.service";


@Injectable()
export class AuthService {
    private utils = utils();

    constructor(
        private usersService: UsersService,
        private usersAccountsService: UsersAccountsService,
        private sessionsService: SessionsService,
        private configService: ConfigService,
        private httpService: HttpService
    ) {}

    async signIn(res: Response, data: SignInDto, ip: string): Promise<TokensDto> {
        const user = this.utils.ifEmptyGivesError(await this.usersService.getModel().getModelByUsername(data.user.username), UserNotFoundException);
        const account = this.utils.ifEmptyGivesError(await this.usersAccountsService.getModel().getModalByUserIdAndType(user.id, 'EMAIL'), AuthorizedAccountNotFoundException)

        if (await bcrypt.compare(data.user.password, user.password)) {
            const { tokens, session } = await this.sessionsService.createSession(user, account.id, ip, data.device);
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

        const screenName = 'ID' + vkUser.id;

        let user = await this.usersService.getModel().getModelByUsername(screenName);
        if (!user && vkUser.screen_name) user = await this.usersService.getModel().getModelByUsername(vkUser.screen_name);
        if (!user) {
            user = await this.usersService.createModel(
                {
                    username: vkUser.screen_name ?? screenName,
                    gender: vkUser.sex === 1 ? 'FEMALE' : vkUser.sex === 2 ? 'MALE' : 'NOT_SPECIFIED',
                    firstName: vkUser.first_name,
                    lastName: vkUser.last_name,
                    birthday: this.formatDateString(vkUser.bdate),
                    description: vkUser.status,
                    photo: vkUser.photo_200
                },
                {
                    UUID: vkUser.id.toString(),
                    type: 'VK'
                }
            );
        }

        const account = this.utils.ifEmptyGivesError(await this.usersAccountsService.getModel().getModalByUserIdAndType(user.id, 'VK'), AuthorizedAccountNotFoundException)

        const { tokens, session } = await this.sessionsService.createSession(user, account.id, ip, payload.device);
        res.cookie('passHash', md5(`${session.id}:${session.ip}`));
        return tokens;
    }

    async refreshToken(session: Session, accessToken: string): Promise<TokensDto> {
        this.utils.ifEmptyGivesError(this.sessionsService.getModel().isTokenAlive(session, accessToken), SessionIsNotValidException);

        return await this.sessionsService.updateSessionById(session.id).then(res => res.tokens);
    }
    async logOut(sessionId: number): Promise<void> {
        try {
            await this.sessionsService.getModel().deleteMinimalById(sessionId);
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
