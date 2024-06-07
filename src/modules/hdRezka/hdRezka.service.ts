import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import * as Imap from "imap";
import {simpleParser} from "mailparser";
import {PrismaService} from "@modules/prisma/prisma.service";
import {HDRezkaMirror, HDRezkaMirrorStatus, Prisma} from '@prisma/client';
import {HttpService} from "@nestjs/axios";
import {MailsService} from "@modules/mails/mails.service";
import {Cron, CronExpression} from "@nestjs/schedule";
import {hdrReqStatus, hdrSearchReq} from "@modules/hdRezka/dto";
import * as Cheerio from "cheerio";

@Injectable()
export class HdRezkaService {
    private logger = new Logger('HdRezkaService');
    private repo: Prisma.HDRezkaMirrorDelegate;
    private imap = new Imap({
        user: this.configService.getOrThrow('EMAIL_USER'),
        password: this.configService.getOrThrow('EMAIL_PASSWORD'),
        host: this.configService.getOrThrow('EMAIL_HOST_TAKE')
    });

    private sizeOfInterval = 2000;
    private mirror: HDRezkaMirror | null;
    private checkMailsListenerId: NodeJS.Timeout;
    private urls = {
        check: '/engine/ajax/search.php',
        search: (q: string) => `/engine/ajax/search.php?q=${q}`
    };

    constructor(
        private mailsService: MailsService,
        private configService: ConfigService,
        private httpService: HttpService,
        prismaService: PrismaService
    ) {
        this.repo = prismaService.hDRezkaMirror;
        this.createListeners();
    }

    async create(url: string) {
        const lastMirror = await this.getLastMirror();
        if (lastMirror) await this.updateStatusByUrl(lastMirror.url, 'OLDEN');
        return this.repo.create({data: {url}});
    }

    updateStatusByUrl(url: string, status: HDRezkaMirrorStatus) {
        return this.repo.update({
            where: { url },
            data: { status }
        });
    }

    getLastMirror() {
        return this.repo.findFirst({
            orderBy: { createdAt: 'desc' }
        });
    }


    async getLastMirrorFromMails(): Promise<string | null> {
        const { imap } = this;

        return new Promise<string | null>((resolve) => {
            imap.openBox('HDREZKA', false, () => {
                imap.search(['ALL'], (e, results) => {
                    if (e || !results.length) return resolve(null);

                    const f = imap.fetch([results.pop()], {bodies: ''});
                    f.on('message', msg => {
                        msg.once('attributes', ({uid}) => imap.addFlags(uid, ['\\Seen'], () => {}));
                        msg.on('body', stream => {
                            simpleParser(stream, async (e, parsed) => {
                                if (e) return resolve(null);
                                const matches = parsed.text.match(/Текущий адрес персонального зеркала:\s(.+?)\n/);
                                if (!matches.length) return resolve(null);
                                resolve(matches[0].split(':')[1].trim())
                            });
                        });
                    });
                    f.once('error', () => resolve(null));
                });
            });
        });
    }


    async searchMovies(text: string): Promise<hdrSearchReq> {
        const body = (status: hdrReqStatus, values = []) => ({
            status,
            values
        });

        if (!this.mirror) return body(hdrReqStatus.NO_MIRROR);

        try {
            const html = await this.httpGet(this.urls.search(text));
            const $ = Cheerio.load(html);
            const listOfElements = $('.b-search__section_list');

            if (!listOfElements.length) return body(hdrReqStatus.OK);

            const rawMovies = listOfElements.find('li');
            const movies = rawMovies.map((_, el) => {
                const $el = $(el);

                return {
                    name: $el.find('.enty').text(),
                    addName: $el.find('a').contents().filter((_, el) => el.nodeType === 3).text().trim(),
                    rating: Number.parseFloat($el.find('.rating').text()) ?? null
                };
            }).get();

            return body(hdrReqStatus.OK, movies);
        } catch (e) {
            return body(e.message);
        }
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async checkActualMirror() {
        this.mirror = await this.getLastMirror();

        if (!this.mirror || this.mirror.status !== 'WORKED') {
            const url = await this.getLastMirrorFromMails();

            if (!url || (this.mirror && url !== this.mirror?.url)) {
                this.mailsService.sendHdRezkaMail();
            }

            this.stopInterval();

            this.checkMailsListenerId = setInterval(async () => {
                const url = await this.getLastMirrorFromMails();

                if (url && (!this.mirror || this.mirror.url !== url)) {
                    this.logger.log('The new mirror has been successfully registered');
                    this.mirror = await this.create(url);
                    this.stopInterval();
                }
            }, this.sizeOfInterval);
        }

        if (this.checkMailsListenerId) return;

        try {
            await this.httpGet(this.urls.check);
            this.logger.log('The current mirror is alive');
        } catch (e) {
            this.logger.warn('The current mirror is invalid, an attempt to register a new one');
            await this.updateStatusByUrl(this.mirror.url, 'UPDATING');
            await this.checkActualMirror();
        }
    }


    private createListeners() {
        this.imap.once('ready', () => {
            this.logger.log('Imap connected successfully');
            this.checkActualMirror();
        });
        this.imap.once('error', (e: any) => {
            this.logger.error('Error to connect Imap');
            console.error(e);
            process.exit(1);
        });

        this.imap.connect();
    }
    private stopInterval() {
        clearInterval(this.checkMailsListenerId);
        this.checkMailsListenerId = undefined;
    }
    private async httpGet(url: string): Promise<string> {
        if (!this.mirror) throw new Error(hdrReqStatus.NO_MIRROR);

        try {
            const { data: html } = await this.httpService.axiosRef.get(`http://${this.mirror.url}${url}`);
            return html;
        } catch (e) {
            throw new Error(hdrReqStatus.ERROR);
        }
    }
}
