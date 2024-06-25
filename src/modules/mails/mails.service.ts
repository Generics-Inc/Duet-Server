import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {PrismaService} from "@modules/prisma/prisma.service";
import {StatusSubscribeDto} from "@modules/mails/dto";
import {utils} from "@root/helpers";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class MailsService {
    private utils = utils();
    private repoSubscribe: Prisma.EmailSubscribersDelegate;
    private subscribeUrl = this.configService.getOrThrow('EMAIL_VERIFY_SUBSCRIBE_URL');

    constructor(
        private configService: ConfigService,
        private mailerService: MailerService,
        prismaService: PrismaService
    ) {
        this.repoSubscribe = prismaService.emailSubscribers;
    }

    sendHdRezkaMail() {
        this.mailerService.sendMail({
            to: 'mirror@hdrezka.org',
            subject: 'GetMirror',
            text: 'welcome',
            html: '<b>welcome</b>'
        });
    }

    async subscribeToMails(email: string): Promise<StatusSubscribeDto> {
        try {
            const code = this.utils.createRandomNumber(100000000, 999999999);

            await this.repoSubscribe.create({
                data: {
                    email,
                    code
                }
            });
            await this.mailerService.sendMail({
                to: email,
                subject: 'Подтверждение подписки на обновления',
                template: 'emailSubscribe',
                context: {
                    LINK: `${this.subscribeUrl}?email=${email}&code=${code}&mode=1`,
                    EMAIL: email,
                    YEAR: (new Date()).getFullYear()
                }
            });

            return { status: 'success' };
        } catch (e) {
            return { status: 'error' };
        }
    }

    async verifyEMail(email: string, code: number): Promise<StatusSubscribeDto> {
        try {
            const record = await this.repoSubscribe.findUniqueOrThrow({
                where: { email, code }
            });
            await this.repoSubscribe.update({
                where: {
                    id: record.id,
                    isVerify: false
                },
                data: {
                    isVerify: true
                }
            });
            await this.mailerService.sendMail({
                to: email,
                subject: 'Успешно подписались на обновления',
                template: 'emailUnsubscribe',
                context: {
                    LINK: `${this.subscribeUrl}?email=${email}&code=${code}&mode=2`,
                    EMAIL: email,
                    YEAR: (new Date()).getFullYear()
                }
            });

            return { status: 'success' };
        } catch (e) {
            return { status: 'error' };
        }
    }

    async unsubscribeFromMails(email: string, code: number): Promise<StatusSubscribeDto> {
        try {
            const record = await this.repoSubscribe.findUniqueOrThrow({
                where: {
                    email,
                    code,
                    isVerify: true
                }
            });
            await this.repoSubscribe.delete({
                where: { id: record.id }
            });

            return { status: 'success' };
        } catch (e) {
            return { status: 'error' };
        }
    }
}
