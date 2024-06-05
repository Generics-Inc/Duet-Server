import {Module} from '@nestjs/common';
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
        SessionsService
    ],
    exports: [
        SessionsModel,
        SessionsService
    ]
})
export class SessionsModule {
}
