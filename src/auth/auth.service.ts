import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
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
    TokenInterface,
    VkAccessInterface,
    VkUserInterface
} from "./interfaces";
import {
    SignInDto,
    VkSignInDto
} from "./dto";
import {CryptoService} from "../crypto.service";
import {SessionsService} from "../sessions/sessions.service";
import {PayloadReturnDto} from "./strategy/dto";
import useUtils from "../composables/useUtils";

@Injectable()
export class AuthService {
    private utils = useUtils();

    vkOrigin = 'https://api.vk.com/method/';

    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
        private usersService: UsersService,
        private httpService: HttpService,
        private cryptoService: CryptoService,
        private sessionsService: SessionsService
    ) {}

    async signIn(data: SignInDto): Promise<TokenInterface> {
        const user = await this.usersService.getUniqueUser({ username: data.user.username });

        if (user) {
            if (await bcrypt.compare(data.user.password, user.password)) {
                const session = await this.sessionsService.createSession(user, data.device);
                return session.tokens;
            } else {
                throw IncorrectPasswordException;
            }
        } else {
            throw UserNotFoundException;
        }
    }
    async logOut(sessionId: number): Promise<void> {
        try {
            await this.sessionsService.closeSession(sessionId);
        } catch (e) {
            throw e;
        }
    }
    async vkSignIn(payload: VkSignInDto): Promise<any> {
        const req = await this.httpService.axiosRef.get(this.vkOrigin + 'auth.exchangeSilentAuthToken', {
            params: {
                v: '5.199',
                access_token: this.configService.get<string>('VK_ACCESS_TOKEN', ''),
                ...payload.vk
            }
        }).then((res: any) => res.data.response) as VkAccessInterface;
        if (!req) throw VKSilentTokenException;

        const vkToken = req.access_token;
        const vkUser = await this.httpService.axiosRef.get(this.vkOrigin + 'account.getProfileInfo', {
            params: {
                v: '5.199',
                access_token: vkToken
            }
        }).then((res: any) => res.data.response) as VkUserInterface;
        if (!vkUser) throw VKGetUserException;

        let user = await this.usersService.getUniqueUser({ username: 'ID' + vkUser.id });
        if (!user && vkUser.screen_name) user = await this.usersService.getUniqueUser({ username: vkUser.screen_name });
        if (!user) {
            const isUserAdmin = vkUser.id == this.configService.get('VK_ADMIN_ID', 0);

            user = await this.usersService.createUser(
                {
                    username: vkUser.screen_name ?? 'ID' + vkUser.id,
                    role: isUserAdmin ? 'ADMIN' : 'USER',
                    vkToken: this.cryptoService.encrypt(vkToken)
                },
                {
                    vkId: vkUser.id,
                    gender: vkUser.sex === 1 ? 'FEMALE' : vkUser.sex === 2 ? 'MALE' : null,
                    firstName: vkUser.first_name,
                    lastName: vkUser.last_name,
                    birthday: this.formatDateString(vkUser.bdate),
                    status: vkUser.status,
                    photo: vkUser.photo_200
                }
            );
        } else {
            user = await this.usersService.updateUser(user.id, { vkToken: this.cryptoService.encrypt(vkToken) });
        }

        const session = await this.sessionsService.createSession(user, payload.device);
        return session.tokens;
    }
    async refreshToken({ user, session }: PayloadReturnDto, accessToken: string): Promise<any> {
        this.utils.ifEmptyGivesError(this.sessionsService.tokenLifeCheck(session, accessToken), SessionIsNotValidException);

        const { tokens } = await this.sessionsService.updateSession(session.id);
        return tokens;
    }

    private formatDateString(date: string): string {
        return date.split('.').map(component => component.length === 1 ? '0' + component : component).join('.');
    }
}
