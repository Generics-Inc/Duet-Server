import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {PrismaService} from "@root/singles";
import {GroupsBaseModule} from "@modules/groupsBase/groupsBase.module";
import {UsersBaseModule} from "@modules/usersBase/usersBase.module";
import {SessionsModule} from "@modules/sessions/sessions.module";
import {ProfilesModule} from "@modules/profiles/profiles.module";
import {GroupsModule} from "@modules/groups/groups.module";
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
        UsersBaseModule,
        GroupsBaseModule,
        AuthModule,
        FilesModule,
        SessionsModule,
        GroupsModule,
        ProfilesModule
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
