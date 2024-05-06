import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {PrismaService, CryptoService} from "../singles";
import {AccessTokenStrategy, RefreshTokenStrategy} from "./strategy";
import {JwtModule} from "@nestjs/jwt";
import {HttpModule} from "@nestjs/axios";
import {UsersModule} from "../users/users.module";
import {SessionsService} from "../sessions/sessions.service";

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
        UsersModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        PrismaService,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        CryptoService,
        SessionsService
    ]
})
export class AuthModule {
}
