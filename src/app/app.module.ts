import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {UsersModule} from '../users/users.module';
import {AuthModule} from '../auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {GroupsModule} from "../groups/groups.module";
import {SessionsModule} from "../sessions/sessions.module";
import {AppService} from './app.service';
import {PrismaService} from "../singles";
import {FilesModule} from "../files/files.module";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {OpenaiService} from "../singles/openai.service";

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
        OpenaiService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
