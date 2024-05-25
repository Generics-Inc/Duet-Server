import {Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Session} from "@prisma/client";
import {UserSession} from "@modules/users/decorator";
import {RefreshDto, SignInDto, TokensDto, VkSignInDto} from "./dto";
import {AccessTokenGuard, RefreshTokenGuard} from "./guard";
import {AuthService} from "./auth.service";
import {Request} from "express";
import {RealIP} from "nestjs-real-ip";


@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Вход с помощью логин/пароль (для SU)' })
    @ApiBody({ type: SignInDto })
    @ApiResponse({ status: 202, type: TokensDto })
    @HttpCode(HttpStatus.ACCEPTED)
    @Post('/signIn')
    signIn(@Body() data: SignInDto, @RealIP() ip: string): Promise<TokensDto> {
        return this.authService.signIn(data, ip);
    }

    @ApiOperation({ summary: 'Вход с помощью VK' })
    @ApiBody({ type: VkSignInDto })
    @ApiResponse({ status: 202, type: TokensDto })
    @HttpCode(HttpStatus.ACCEPTED)
    @Post('/vkSignIn')
    vkSignIn(@Body() data: VkSignInDto, @RealIP() ip: string): Promise<TokensDto> {
        return this.authService.vkSignIn(data, ip);
    }

    @ApiOperation({ summary: 'Выход из аккаунта (с удалением сессии) [Рекомендуется]' })
    @ApiResponse({ status: 204 })
    @ApiSecurity('AccessToken')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('/logout')
    @UseGuards(AccessTokenGuard)
    logOut(@UserSession('id') sessionId: number): Promise<void> {
        return this.authService.logOut(sessionId);
    }

    @ApiOperation({ summary: 'Обновление токена доступа токеном обновления' })
    @ApiBody({ type: RefreshDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: TokensDto })
    @ApiSecurity('RefreshToken')
    @HttpCode(HttpStatus.CREATED)
    @Post('/refresh')
    @UseGuards(RefreshTokenGuard)
    refreshToken(@UserSession() session: Session, @Body() body: RefreshDto) {
        return this.authService.refreshToken(session, body.accessToken);
    }
}
