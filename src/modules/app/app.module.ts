import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {SessionsModule} from "@modules/sessions/sessions.module";
import {HdRezkaModule} from "@modules/hdRezka/hdRezka.module";
import {PrismaModule} from "@modules/prisma/prisma.module";
import {GroupsModule} from "@modules/groups/groups.module";
import {MoviesModule} from "@modules/movies/movies.module";
import {TasksModule} from "@modules/tasks/tasks.module";
import {UsersModule} from "@modules/users/users.module";
import {MailsModule} from "@modules/mails/mails.module";
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
        PrismaModule,
        HdRezkaModule,
        MailsModule,
        TasksModule,
        FilesModule,
        SessionsModule,
        GroupsModule,
        UsersModule,
        MoviesModule
    ],
    controllers: [
        AppController
    ],
    providers: [
        AppService,
        // {
        //     provide: APP_GUARD,
        //     useClass: ThrottlerGuard
        // }
    ]
})
export class AppModule {}
