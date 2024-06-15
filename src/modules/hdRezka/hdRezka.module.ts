import {Module} from '@nestjs/common';
import {HdRezkaController} from './hdRezka.controller';
import {HdRezkaService} from './hdRezka.service';
import {HttpModule} from "@nestjs/axios";
import {MailsModule} from "@modules/mails/mails.module";


@Module({
    imports: [
        MailsModule,
        HttpModule
    ],
    controllers: [
        HdRezkaController
    ],
    providers: [
        HdRezkaService
    ],
    exports: [
        HdRezkaService
    ]
})
export class HdRezkaModule {}
