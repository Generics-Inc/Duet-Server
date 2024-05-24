import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {SessionsModelService} from "./sessions.service";

@Module({
    providers: [
        SessionsModelService,
        PrismaService
    ],
    exports: [
        SessionsModelService
    ]
})
export class SessionsModel {
}
