import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import * as Imap from "imap";
import {simpleParser} from "mailparser";
import {PrismaService} from "@modules/prisma/prisma.service";
import {HDRezkaMirror, HDRezkaMirrorStatus, MovieType, Prisma} from '@prisma/client';
import {HttpService} from "@nestjs/axios";
import {MailsService} from "@modules/mails/mails.service";
import {Cron, CronExpression} from "@nestjs/schedule";
import {HdrMovieDto, HdrSearchReq} from "@modules/hdRezka/dto";
import * as Cheerio from "cheerio";
import {ParseException, ProviderResourceFoundException} from "@root/errors";
import {utils} from "@root/helpers";
import {HdrReqStatusInterface} from "@modules/hdRezka/interfaces";


@Injectable()
export class HdRezkaService {
    private logger = new Logger('HdRezkaService');
    private utils = utils();
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
        check: 'engine/ajax/search.php',
        search: (q: string) => `engine/ajax/search.php?q=${q}`
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

    async createMirror(url: string) {
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

    async getMovieData(movieLink: string): Promise<HdrMovieDto> {
        const getText = (e: Cheerio.Cheerio<Cheerio.Element>, q?: string) => (q ? e.find(q) : e).text().trim();
        const getAttr = (e: Cheerio.Cheerio<Cheerio.Element>, q: string, a: string) => e.find(q).attr(a)?.trim();
        const getInfo = (e: Cheerio.Cheerio<Cheerio.Element>, q: string) => e.find(`tr td:first-child h2:contains("${q}")`).parents('tr').find('td:last-child');

        if (movieLink.split('/').length !== 3) throw ParseException;

        try {
            const html = this.utils.ifEmptyGivesError(await this.httpGet(movieLink, 'all'), ParseException);
            const $ = Cheerio.load(html);
            this.utils.ifEmptyGivesError($('.b-info__message').text() !== 'Страница не найдена', ProviderResourceFoundException);
            const $content = $('.b-content__main');
            const $info = $content.find('.b-post__infotable');
            const $parts = $content.find('.b-post__partcontent_item');

            return {
                name: getText($content, '.b-post__title'),
                originalName: getText($content, '.b-post__origtitle'),
                slogan: getText(getInfo($info, 'Слоган')),
                link: movieLink,
                photo: getAttr($info, '.b-sidecover a', 'href'),
                releaseDate: this.parseMovieDate(getText(getInfo($info, 'Дата выхода'))),
                country: getText(getInfo($info, 'Страна')),
                ageRating: parseInt(getText(getInfo($info, 'Возраст'), 'span').split('+')[0]),
                time: parseInt(getText(getInfo($info, 'Время')).split('мин')[0]),
                description: getText($content, '.b-post__description'),
                type: this.parseMovieType(movieLink.split('/')[0]),

                ratings: [
                    ...getInfo($info, 'Рейтинги').find('.b-post__info_rates').map((_, el) => ({
                        name: getText($(el), 'a'),
                        countOfScopes: parseInt(getText($(el), 'i').replace(' ', '').match(/\d+/)[0]),
                        scope: parseFloat(getText($(el), 'span.bold')),
                    })).get(),
                    {
                        name: 'HDRezka',
                        countOfScopes: parseInt(getText($content, '.b-post__rating .votes span')),
                        scope: parseFloat(getText($content, '.b-post__rating:first-child span:nth-child(2)')),
                    }
                ],
                genres: getInfo($info, 'Жанр').find('a').map((_, el) => getText($(el))).get(),
                parts: $parts.length > 1 ? $parts.map((_, el) => {
                    const link = this.parseMovieUrl(getAttr($(el), '.title a', 'href')) ?? movieLink;
                    return {
                        name: getText($(el), '.title'),
                        current: link === movieLink,
                        link: link,
                        releaseYear: parseInt(getText($(el), '.year').split(' ')[0]),
                        type: this.parseMovieType(link.split('/')[0]),
                        rating: parseFloat(getText($(el), '.rating i'))
                    };
                }).get() : [],
                seasons: $content.find('.b-post__schedule_block').map((_, el) => {
                    const $series = $(el).find('tbody tr').filter((_, el) => $(el).find('.td-4').length > 0);
                    return {
                        number: parseInt(getText($(el), '.title').match(/\d+\sсезон(?:а)?/g)[0].split(' ')[0]),
                        releaseDate: this.parseMovieDate(getText($series.last().find('.td-4'))),
                        series: $series.map((i, el) => ({
                            name: getText($(el), '.td-2 b'),
                            number: $series.length - i,
                            releaseDate: this.parseMovieDate(getText($(el).find('.td-4')))
                        })).get()
                    }
                }).get()
            } as unknown as HdrMovieDto;
        } catch (e) {
            console.error('Долбаёб, иди спи', e);
            throw e;
        }
    }

    async searchMovies(text: string): Promise<HdrSearchReq> {
        const body = (status: HdrReqStatusInterface, values = []) => ({
            status,
            values
        });

        try {
            const html = await this.httpGet(this.urls.search(text));
            const $ = Cheerio.load(html);
            const listOfElements = $('.b-search__section_list');

            if (!listOfElements.length) return body(HdrReqStatusInterface.OK);

            const rawMovies = listOfElements.find('li');
            const movies = rawMovies.map((_, el) => {
                const $el = $(el);
                const rawLink = $el.find('a').attr('href').split('/').slice(3);

                return {
                    name: $el.find('.enty').text(),
                    addName: $el.find('a').contents().filter((_, el) => el.nodeType === 3).text().trim(),
                    url: rawLink.join('/'),
                    type: this.parseMovieType(rawLink[0]),
                    rating: Number.parseFloat($el.find('.rating').text()) ?? null
                };
            }).get();

            return body(HdrReqStatusInterface.OK, movies);
        } catch (e) {
            return body(e.message);
        }
    }


    @Cron(CronExpression.EVERY_10_MINUTES)
    async checkActualMirror() {
        this.mirror = await this.getLastMirror();

        if (!this.mirror || this.mirror.status !== 'WORKED') {
            const url = await this.getLastMirrorFromMails();

            if (!url || (this.mirror && url === this.mirror?.url)) {
                this.mailsService.sendHdRezkaMail();
            }

            this.stopInterval();

            this.checkMailsListenerId = setInterval(async () => {
                const url = await this.getLastMirrorFromMails();

                if (url && (!this.mirror || this.mirror.url !== url)) {
                    this.logger.log('The new mirror has been successfully registered');
                    this.mirror = await this.createMirror(url);
                    this.stopInterval();
                    this.checkActualMirror();
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


    private parseMovieUrl(url: string) {
        const urlParts = (url ?? '').split('/');
        if (urlParts.length < 3) return undefined;
        return urlParts.slice(3).join('/');
    };
    private parseMovieDate(date: string) {
        const dateParts = date.split(' ');
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        return new Date(+dateParts[2], months.findIndex(month => dateParts[1] === month), +dateParts[0] + 1, 0, 0, 0);
    };
    private parseMovieType(t: string): MovieType {
        switch (t) {
            case 'series':
                return 'SERIAL';
            case 'cartoons':
                return 'CARTOON';
            case 'animation':
                return 'ANIME';
            default:
                return 'FILM';
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
    private async httpGet(url: string, responseType: 'success' | 'all' = 'success'): Promise<string> {
        if (!this.mirror) throw new Error(HdrReqStatusInterface.NO_MIRROR);

        try {
            const { data: html } = await this.httpService.axiosRef.get(`http://${this.mirror.url}/${url}`);
            return html;
        } catch (e) {
            if (responseType === 'all') return e.response?.data;
            throw new Error(HdrReqStatusInterface.ERROR);
        }
    }
}
