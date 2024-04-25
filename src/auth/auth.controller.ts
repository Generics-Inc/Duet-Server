import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AccessTokenGuard, RefreshTokenGuard} from "./guard";
import {
    SignInDto,
    VkSignInDto,
    RefreshDto, TokensDto
} from "./dto";
import {UserSession} from "../users/decorator";
import {ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Session} from "@prisma/client";


@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Вход с помощью логин/пароль (для SU)' })
    @ApiBody({ type: SignInDto })
    @ApiResponse({ status: 202, type: TokensDto })
    @HttpCode(HttpStatus.ACCEPTED)
    @Post('/signIn')
    signIn(@Body() data: SignInDto): Promise<TokensDto> {
        return this.authService.signIn(data);
    }

    @ApiOperation({ summary: 'Вход с помощью VK' })
    @ApiBody({ type: VkSignInDto })
    @ApiResponse({ status: 202, type: TokensDto })
    @HttpCode(HttpStatus.ACCEPTED)
    @Post('/vkSignIn')
    vkSignIn(@Body() data: VkSignInDto): Promise<TokensDto> {
        return this.authService.vkSignIn(data);
    }

    @ApiOperation({ summary: 'Выход из аккаунта (с удалением сессии) [Рекомендуется]' })
    @ApiResponse({ status: 204 })
    @ApiSecurity('AccessToken')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('/logout')
    logOut(@UserSession('id') sessionId: number): Promise<void> {
        return this.authService.logOut(sessionId);
    }

    @ApiOperation({ summary: 'Обновление токена доступа токеном обновления' })
    @ApiBody({ type: RefreshDto })
    @ApiResponse({ status: 205, type: TokensDto })
    @ApiSecurity('RefreshToken')
    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.RESET_CONTENT)
    @Post('/refresh')
    refreshToken(@UserSession() session: Session, @Body() body: RefreshDto): Promise<TokensDto> {
        return this.authService.refreshToken(session, body.accessToken);
    }
}
