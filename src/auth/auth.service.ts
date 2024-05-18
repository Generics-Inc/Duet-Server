import { Injectable } from '@nestjs/common';
import * as bcrypt from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { UsersService } from "../users/users.service";
import {
    IncorrectPasswordException, SessionIsNotValidException,
    UserNotFoundException,
    VKGetUserException,
    VKSilentTokenException
} from "../errors";
import {
    VkAccessInterface,
    VkUserInterface
} from "./interfaces";
import {
    SignInDto, TokensDto,
    VkSignInDto
} from "./dto";
import {SessionsService} from "../sessions/sessions.service";
import useUtils from "../composables/useUtils";
import {Session} from "@prisma/client";
import {ExceptionGenerator} from "../errors/ExceptionGenerator";

@Injectable()
export class AuthService {
    private utils = useUtils();

    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
        private httpService: HttpService,
        private sessionsService: SessionsService
    ) {}

    async signIn(data: SignInDto): Promise<TokensDto> {
        const user = this.utils.ifEmptyGivesError(await this.usersService.getUniqueUser({ username: data.user.username }), UserNotFoundException);

        if (await bcrypt.compare(data.user.password, user.password)) {
            return await this.sessionsService.createSession(user, data.device).then(r => r.tokens);
        } else {
            throw IncorrectPasswordException;
        }
    }
    async vkSignIn(payload: VkSignInDto): Promise<TokensDto> {
        const vkToken = payload.vk.uuid ? await this.vkRequest<VkAccessInterface>('auth.exchangeSilentAuthToken', {
            access_token: this.configService.get<string>('VK_ACCESS_TOKEN', ''),
            ...payload
        }, VKSilentTokenException).then(r => r.access_token) : payload.vk.token;
        const vkUser = await this.vkRequest<VkUserInterface>('account.getProfileInfo', {
            access_token: vkToken
        }, VKGetUserException);

        let user = await this.usersService.getUniqueUser({ username: 'ID' + vkUser.id });
        if (!user && vkUser.screen_name) user = await this.usersService.getUniqueUser({ username: vkUser.screen_name });
        if (!user) {
            user = await this.usersService.createUser(
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

        return await this.sessionsService.createSession(user, payload.device).then(r => r.tokens);
    }
    async refreshToken(session: Session, accessToken: string): Promise<TokensDto> {
        this.utils.ifEmptyGivesError(this.sessionsService.tokenLifeCheck(session, accessToken), SessionIsNotValidException);

        return await this.sessionsService.updateSession(session.id).then(res => res.tokens);
    }
    async logOut(sessionId: number): Promise<void> {
        try {
            await this.sessionsService.closeSession(sessionId);
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
