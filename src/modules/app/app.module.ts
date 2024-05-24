import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {PrismaService} from "@root/singles";
import {SessionsModule} from "@modules/sessions/sessions.module";
import {GroupsModule} from "@modules/groups/groups.module";
import {UsersModule} from "@modules/users/users.module";
import {FilesModule} from "@modules/files/files.module";
import {AuthModule} from "@modules/auth/auth.module";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 20
            }
        ]),
        AuthModule,
        FilesModule,
        SessionsModule,
        GroupsModule,
        UsersModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        PrismaService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
