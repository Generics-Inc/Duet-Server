import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
    constructor(private mailerService: MailerService) {}

    sendHdRezkaMail() {
        this.mailerService.sendMail({
            to: 'mirror@hdrezka.org',
            subject: 'GetMirror', // Subject line
            text: 'welcome', // plaintext body
            html: '<b>welcome</b>', // HTML body content
        });
    }
}
