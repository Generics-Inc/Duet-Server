import {Module} from '@nestjs/common';
import {SessionsController} from './sessions.controller';
import {SessionsService} from './sessions.service';
import {PrismaService} from "../singles";

@Module({
    controllers: [SessionsController],
    providers: [
        SessionsService,
        PrismaService
    ],
    exports: [
        SessionsService
    ]
})
export class SessionsModule {
}
