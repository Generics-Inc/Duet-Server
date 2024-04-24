import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AccessTokenGuard, RefreshTokenGuard} from "./guard";
import {PayloadReturnDto} from "./strategy/dto";
import {
    SignInDto,
    VkSignInDto
} from "./dto";
import {UserData, UserSession} from "../users/decorator";
import {TokenInterface} from "./interfaces";
import {UserAuth} from "../users/decorator/user-auth.decorator";
import {RefreshDto} from "./dto/refresh.dto";


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('/signIn')
    signIn(@Body() data: SignInDto): Promise<TokenInterface> {
        return this.authService.signIn(data);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/vkSignIn')
    vkSignIn(@Body() data: VkSignInDto): Promise<TokenInterface> {
        return this.authService.vkSignIn(data);
    }

    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Post('/logout')
    logOut(@UserSession('id') sessionId: number): Promise<void> {
        return this.authService.logOut(sessionId);
    }

    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Post('/refresh')
    refreshToken(@UserAuth() session: PayloadReturnDto, @Body() body: RefreshDto): Promise<TokenInterface> {
        return this.authService.refreshToken(session, body.accessToken);
    }
}
