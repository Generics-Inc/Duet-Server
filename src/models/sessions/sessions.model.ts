import {Module} from '@nestjs/common';
import {SessionsModelService} from "./sessions.service";

@Module({
    providers: [
        SessionsModelService
    ],
    exports: [
        SessionsModelService
    ]
})
export class SessionsModel {
}
