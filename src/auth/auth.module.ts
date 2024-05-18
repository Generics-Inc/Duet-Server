import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {AccessTokenStrategy, RefreshTokenStrategy} from "./strategy";
import {JwtModule} from "@nestjs/jwt";
import {HttpModule} from "@nestjs/axios";
import {UsersModule} from "../users/users.module";
import {SessionsModule} from "../sessions/sessions.module";

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
        UsersModule,
        SessionsModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AccessTokenStrategy,
        RefreshTokenStrategy
    ]
})
export class AuthModule {
}
