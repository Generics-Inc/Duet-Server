import {Module} from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";
import {HttpModule} from "@nestjs/axios";
import {SessionsModule} from "@modules/sessions/sessions.module";
import {UsersModule} from "@modules/users/users.module";
import {AccessTokenStrategy, RefreshTokenStrategy} from "./strategy";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.SECRET ?? '',
            signOptions: {
                expiresIn: '24h'
            }
        }),
        HttpModule.register({}),
        SessionsModule,
        UsersModule
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        AccessTokenStrategy,
        RefreshTokenStrategy
    ]
})
export class AuthModule {
}
