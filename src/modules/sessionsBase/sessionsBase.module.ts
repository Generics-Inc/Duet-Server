import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {SessionsBaseService} from "./sessionsBase.service";

@Module({
    providers: [
        SessionsBaseService,
        PrismaService
    ],
    exports: [
        SessionsBaseService
    ]
})
export class SessionsBaseModule {
}
