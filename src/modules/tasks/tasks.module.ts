import {Module} from '@nestjs/common';
import {ScheduleModule} from "@nestjs/schedule";
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {TasksService} from "@modules/tasks/tasks.service";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {XmlParserQueue} from "@modules/tasks/queues/xml-parser.queue";
import {SearcherModule} from "@modules/searcher/searcher.module";
import {MoviesModel} from "@models/movies/movies.model";
import {FilesModule} from "@modules/files/files.module";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const user = configService.get('RABBITMQ_DEFAULT_USER');
                const password = configService.get('RABBITMQ_DEFAULT_PASS');
                const host = configService.get('RABBITMQ_HOST');

                return {
                    exchanges: [
                        {
                            name: 'exchange',
                            type: 'topic',
                        },
                    ],
                    uri: `amqp://${user}:${password}@${host}`,
                    connectionInitOptions: { wait: true },
                    prefetchCount: 1,
                    enableControllerDiscovery: true
                };
            },
        }),
        SearcherModule,
        MoviesModel,
        FilesModule
    ],
    providers: [
        TasksService,
        XmlParserQueue
    ],
    exports: [
        TasksService
    ]
})
export class TasksModule {
}
