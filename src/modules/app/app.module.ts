import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {PrismaService} from "@root/singles";
import {UsersModule} from "@modules/users/users.module";
import {AuthModule} from "@modules/auth/auth.module";
import {GroupsModule} from "@modules/groups/groups.module";
import {SessionsModule} from "@modules/sessions/sessions.module";
import {FilesModule} from "@modules/files/files.module";
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
        UsersModule,
        AuthModule,
        GroupsModule,
        SessionsModule,
        FilesModule
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
