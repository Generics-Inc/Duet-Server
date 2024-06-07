import {Injectable} from "@nestjs/common";
import {AmqpConnection, RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import {SkipThrottle} from "@nestjs/throttler";
import { utils } from "@root/helpers";


@Injectable()
@SkipThrottle()
export class XmlParserQueue {
    private utils = utils();
    private everyNSeconds = 5;

    constructor(
        private rmqConnect: AmqpConnection
    ) {}

    @RabbitSubscribe({
        exchange: 'exchange',
        routingKey: 'xml.parser',
        queue: 'xml.parser.queue',
        queueOptions: {
            durable: true
        }
    })
    async handler() {
        const start = Date.now();

        try {

        } catch (e) {
        }

        await this.utils.syncWait(this.everyNSeconds * 1000 - (Date.now() - start));
    }

    private validateLoadPhoto(photos: Buffer[]) {
        if (!photos.length) throw new Error("Фотография не была найдена или загружена");
    }
}
