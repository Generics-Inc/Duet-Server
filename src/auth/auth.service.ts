import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { Prisma, User } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { UsersService } from "../users/users.service";
import { PayloadReturnDto } from "./strategy/dto/payload.dto";
import {
    DeviceIsNotFoundException,
    IncorrectPasswordException,
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

@Injectable()
export class AuthService {
    vkOrigin = 'https://api.vk.com/method/';

    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
        private jwtService: JwtService,
        private usersService: UsersService,
        private httpService: HttpService,
        private cryptoService: CryptoService
    ) {}

    async signIn(data: SignInDto): Promise<TokenInterface> {
        const user = await this.usersService.getUser({ username: data.user.username });

        if (user) {
            if (await bcrypt.compare(data.user.password, user.password)) {
                const tokens = await this.createTokens(user);
                await this.updateRefreshToken(user.id, tokens.refreshToken);
                return tokens;
            } else {
                throw IncorrectPasswordException;
            }
        } else {
            throw UserNotFoundException;
        }
    }
    async logOut(userId: number): Promise<void> {
        try {
            // await this.usersService.updateUser(userId, {
            //     refreshToken: null
            // });
        } catch (e) {
            throw DeviceIsNotFoundException;
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

        let user = await this.usersService.getUser({ username: 'ID' + vkUser.id });
        if (!user && vkUser.screen_name) user = await this.usersService.getUser({ username: vkUser.screen_name });
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

        const tokens = await this.createTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async refreshToken({ user, token }: PayloadReturnDto): Promise<any> {
        // const refreshTokenMatches = await bcrypt.compare(
        //     user.refreshToken,
        //     token
        // );
        //if (!refreshTokenMatches) throw AuthorizedSessionNotFoundException;

        const tokens = await this.createTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }


    private hashData(data: string): string {
        return bcrypt.hashSync(data, 10);
    }
    private formatDateString(date: string): string {
        return date.split('.').map(component => component.length === 1 ? '0' + component : component).join('.');
    }
    private async createTokens(data: User): Promise<TokenInterface> {
        const payload = {
            id: data.id,
            username: data.username
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('ACCESS_SECRET', ''),
                expiresIn: '3d'
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('REFRESH_SECRET', ''),
                expiresIn: '14d'
            })
        ])

        return { accessToken, refreshToken };
    }
    private async updateRefreshToken(userId: number, token: string): Promise<void> {
        const tokenHashed = this.hashData(token);
        // await this.usersService.updateUser(userId, {
        //     refreshToken: tokenHashed
        // });
    }
}
