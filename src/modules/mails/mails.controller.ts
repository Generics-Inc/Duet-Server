import {Body, Controller, Post} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {MailsService} from "./mails.service";
import {StatusSubscribeDto, SubscribeDto, SubscribeVerifyDto, UnsubscribeDto} from "@modules/mails/dto";

@ApiTags('Почтовый сервис')
@Controller('mails')
export class MailsController {
    constructor(private selfService: MailsService) {}

    @ApiOperation({ summary: 'Подписаться на уведомления об обновлении проекта на почту' })
    @ApiBody({ type: SubscribeDto })
    @ApiResponse({ status: 201, type: StatusSubscribeDto })
    @Post('subscribe')
    subscribeToMails(@Body() body: SubscribeDto) {
        return this.selfService.subscribeToMails(body.email);
    }
    @ApiOperation({ summary: 'Подтвердить подписку на уведомления' })
    @ApiBody({ type: SubscribeVerifyDto })
    @ApiResponse({ status: 201, type: StatusSubscribeDto })
    @Post('subscribe-verify')
    verifyEMail(@Body() body: SubscribeVerifyDto) {
        return this.selfService.verifyEMail(body.email, body.code);
    }

    @ApiOperation({ summary: 'Отписаться от уведомлений' })
    @ApiBody({ type: UnsubscribeDto })
    @ApiResponse({ status: 201, type: StatusSubscribeDto })
    @Post('unsubscribe')
    unsubscribeFromMails(@Body() body: UnsubscribeDto) {
        return this.selfService.unsubscribeFromMails(body.email, body.code);
    }
}
