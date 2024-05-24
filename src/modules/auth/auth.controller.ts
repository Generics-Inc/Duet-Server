import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Session} from "@prisma/client";
import {UserSession} from "@modules/usersBase/decorator";
import {AuthService} from "./auth.service";
import {RefreshDto, SignInDto, TokensDto, VkSignInDto} from "./dto";
import {AccessTokenGuard, RefreshTokenGuard} from "./guard";


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
