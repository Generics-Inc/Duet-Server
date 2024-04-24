import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AccessTokenGuard, RefreshTokenGuard} from "./guard";
import {PayloadReturnDto} from "./strategy/dto/payload.dto";
import {UserSession} from "../users/decorator/user-session.decorator";
import {
    SignInDto,
    VkSignInDto
} from "./dto";
import {UserData} from "../users/decorator/user-data.decorator";
import {TokenInterface} from "./interfaces";


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
    logOut(@UserData() user: PayloadReturnDto['user']): Promise<void> {
        return this.authService.logOut(user.id);
    }

    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Post('/refresh')
    refreshToken(@UserSession() session: PayloadReturnDto): Promise<TokenInterface> {
        return this.authService.refreshToken(session);
    }
}
