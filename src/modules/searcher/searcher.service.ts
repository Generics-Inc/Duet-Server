import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import { XMLParser } from 'fast-xml-parser';
import {HttpService} from "@nestjs/axios";
import {SearcherGetConfig, SearcherXML} from "@modules/types";
import {SearcherException} from "@root/errors";
import getImageBufferByLink from "@root/helpers/getImageBufferByLink";


@Injectable()
export class SearcherService {
    private readonly xmlParser = new XMLParser();
    private readonly origin = 'https://xmlriver.com/search/xml?setab=images&';
    private readonly key: string;
    private readonly user: string;

    private defaultConfig: Partial<SearcherGetConfig> = {
        count: 1,
        countOfTrys: 10,
        isFamilySearch: false
    }

    constructor(
        private configService: ConfigService,
        private httpService: HttpService
    ) {
        this.key = this.configService.getOrThrow('XML_RIVER_KEY');
        this.user = this.configService.getOrThrow('XML_RIVER_USER');
    }

    private url(config: SearcherGetConfig) {
        let url = this.origin + `user=${this.user}&key=${this.key}&query=${config.text}`;

        url += config.groupBy !== undefined ? `&groupby=${config.groupBy}` : '';
        url += config.page !== undefined ? `&p=${config.page}` : '';
        url += config.isFamilySearch !== undefined ? `&fyandex=${+config.isFamilySearch}` : '';
        url += config.site !== undefined ? `&site=${config.site}` : '';
        url += config.imageType !== undefined ? `&itype=${config.imageType}` : '';
        url += config.imageOrient !== undefined ? `&iorient=${config.imageOrient}` : '';
        url += config.imageSize !== undefined ? `&isize=${config.imageSize}` : '';
        url += config.imageColor !== undefined ? `&icolor=${config.imageColor}` : '';

        return url;
    }

    private getConfig(config: SearcherGetConfig) {
        return { ...this.defaultConfig, ...config };
    }

    private parseXMLData(rawData: string) {
        const data = this.xmlParser.parse(rawData).yandexsearch as SearcherXML;

        if (data.response.error) throw SearcherException;

        return data;
    }

    private async getXML(config: SearcherGetConfig) {
        const responseXml = await this.httpService.axiosRef.get(this.url(config));
        return this.parseXMLData(responseXml.data);
    }

    async getURLs(config: SearcherGetConfig) {
        const _config = this.getConfig(config);
        const xml = await this.getXML(_config);

        return xml.response.results.grouping.group.slice(0, _config.count).map(row => row.doc.imgurl);
    }
    async getImages(config: SearcherGetConfig) {
        const _config = this.getConfig(config);
        const urls = await this.getURLs({ ..._config, count: _config.countOfTrys });
        const loadedImages: Buffer[] = [];

        for (const url of urls) {
            try {
                if (loadedImages.length >= _config.count) continue;

                loadedImages.push(await getImageBufferByLink(url));
            } catch (e) {}
        }

        return loadedImages;
    }
}
