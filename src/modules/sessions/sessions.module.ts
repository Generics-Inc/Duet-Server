import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {SessionsService} from "./sessions.service";
import {SessionsController} from "./sessions.controller";

@Module({
    controllers: [SessionsController],
    providers: [
        SessionsService,
        PrismaService
    ],
    exports: [
        SessionsService,
        PrismaService
    ]
})
export class SessionsModule {
}
