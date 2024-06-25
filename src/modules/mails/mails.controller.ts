import {Body, Controller, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {MailsService} from "./mails.service";
import {SubscribeDto, SubscribeVerifyDto, UnsubscribeDto} from "@modules/mails/dto";

@ApiTags('Почтовый сервис')
@Controller('mails')
export class MailsController {
    constructor(private selfService: MailsService) {}

    @Post('subscribe')
    subscribeToMails(@Body() body: SubscribeDto) {
        return this.selfService.subscribeToMails(body.email);
    }

    @Post('subscribe-verify')
    verifyEMail(@Body() body: SubscribeVerifyDto) {
        return this.selfService.verifyEMail(body.email, body.code);
    }

    @Post('unsubscribe')
    unsubscribeFromMails(@Body() body: UnsubscribeDto) {
        return this.selfService.unsubscribeFromMails(body.email, body.code);
    }
}
