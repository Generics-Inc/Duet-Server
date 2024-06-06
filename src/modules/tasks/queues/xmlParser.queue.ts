import {Injectable} from "@nestjs/common";
import {AmqpConnection, RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import {SkipThrottle} from "@nestjs/throttler";
import {XmlParserMessageDto} from "@modules/tasks/dto";
import {SearcherService} from "@modules/searcher/searcher.service";
import {MoviesModelService} from "@models/movies/movies.service";
import {FilesService} from "@modules/files/files.service";
import {Movie} from "@prisma/client";

@Injectable()
@SkipThrottle()
export class XmlParserQueue {
    private everyNSeconds = 5;

    constructor(
        private rmqConnect: AmqpConnection,
        private searcherService: SearcherService,
        private moviesModelService: MoviesModelService,
        private filesService: FilesService
    ) {}

    @RabbitSubscribe({
        exchange: 'exchange',
        routingKey: 'xml.parser',
        queue: 'xml.parser.queue',
        queueOptions: {
            durable: true
        }
    })
    async handler(msg: XmlParserMessageDto) {
        const start = Date.now();
        let movie: Movie;

        try {
            movie = await this.moviesModelService.getMovieById(msg.reqId);
            this.validateMovieExists(movie);

            const photos = await this.searcherService.getImages({
                count: 1,
                countOfTrys: 10,
                imageOrient: 'vertical',
                imageSize: 'medium',
                text: `Постер к ${msg.text}`
            });
            this.validateLoadPhoto(photos);

            const fileLink = await this.filesService.upload({
                profileId: -1,
                bucketName: 'movie',
                fileName: 'main',
                fileDir: movie.id.toString(),
                file: photos[0]
            })
            await this.moviesModelService.updateMoviePhotoById(movie.id, fileLink);
        } catch (e) {
            if (movie) await this.moviesModelService.updateMoviePhotoById(movie.id, 'error');
        }

        await utils().syncWait(this.everyNSeconds * 1000 - (Date.now() - start));
    }

    private validateLoadPhoto(photos: Buffer[]) {
        if (!photos.length) throw new Error("Фотография не была найдена или загружена");
    }
    private validateMovieExists(movie: Movie) {
        if (!movie) throw new Error("Запись в таблице не найдена");
    }
}
