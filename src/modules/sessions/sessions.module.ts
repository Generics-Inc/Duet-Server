import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {SessionsModel} from "@models/sessions/sessions.model";
import {SessionsService} from "./sessions.service";
import {SessionsController} from "./sessions.controller";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [
        SessionsModel,
        HttpModule
    ],
    controllers: [
        SessionsController
    ],
    providers: [
        SessionsService,
        PrismaService
    ],
    exports: [
        SessionsModel,
        SessionsService,
        PrismaService
    ]
})
export class SessionsModule {
}
