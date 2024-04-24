import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {UsersModule} from '../users/users.module';
import {AuthModule} from '../auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {GroupsModule} from "../groups/groups.module";
import {SessionsModule} from "../sessions/sessions.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        ScheduleModule.forRoot(),
        UsersModule,
        AuthModule,
        GroupsModule,
        SessionsModule
    ],
    controllers: [AppController]
})
export class AppModule {}
