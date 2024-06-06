import {Module} from '@nestjs/common';
import {SessionsModel} from "@models/sessions/sessions.model";
import {SessionsService} from "./sessions.service";
import {SessionsController} from "./sessions.controller";

@Module({
    imports: [
        SessionsModel
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
