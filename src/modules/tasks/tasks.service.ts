import {Injectable, Logger} from '@nestjs/common';
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";
import {Options} from "amqp-connection-manager";
import {XmlParserMessageDto} from "@modules/tasks/dto";

@Injectable()
export class TasksService {
    private logger = new Logger('RabbitMQService');

    constructor(private rmqConnect: AmqpConnection) {}

    private sendMessage<T extends any>(routingKey: string, message: T, options?:  Options.Publish) {
        return this.rmqConnect.publish('exchange', routingKey, message, options);
    }

    sendMessageToXMLParserQueue(body: XmlParserMessageDto) {
        this.sendMessage('xml.parser', body);
    }
}

