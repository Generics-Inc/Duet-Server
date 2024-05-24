import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {SessionsBaseModule} from "@modules/sessionsBase/sessionsBase.module";
import {SessionsService} from "./sessions.service";
import {SessionsController} from "./sessions.controller";

@Module({
    imports: [
        SessionsBaseModule
    ],
    controllers: [
        SessionsController
    ],
    providers: [
        SessionsService,
        PrismaService
    ],
    exports: [
        SessionsBaseModule,
        SessionsService,
        PrismaService
    ]
})
export class SessionsModule {
}
