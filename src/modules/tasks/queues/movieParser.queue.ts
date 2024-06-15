import {Injectable} from "@nestjs/common";
import {AmqpConnection, RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import {SkipThrottle} from "@nestjs/throttler";
import {MovieParserMessageDto} from "@modules/tasks/dto";
import { utils } from "@root/helpers";
import {GroupsMoviesModelService} from "@models/groups/movies/movies.service";
import {HdRezkaService} from "@modules/hdRezka/hdRezka.service";
import {MoviesModelService} from "@models/movies/movies.service";
import {GroupMovieCreateTaskDto} from "@models/groups/movies/dto";
import {FilesService} from "@modules/files/files.service";
import getImageBufferByLink from "@root/helpers/getImageBufferByLink";


@Injectable()
@SkipThrottle()
export class MovieParserQueue {
    private utils = utils();
    private everyNSeconds = 5;

    constructor(
        private rmqConnect: AmqpConnection,
        private groupsMovieModelService: GroupsMoviesModelService,
        private moviesModelService: MoviesModelService,
        private hdRezkaService: HdRezkaService,
        private filesService: FilesService
    ) {}

    @RabbitSubscribe({
        exchange: 'exchange',
        routingKey: 'movie.parser',
        queue: 'movie.parser.queue',
        queueOptions: {
            durable: true
        }
    })
    async handler(msg: MovieParserMessageDto) {
        const start = Date.now();
        let taskCreate: GroupMovieCreateTaskDto;

        try {
            taskCreate = await this.groupsMovieModelService.getTaskById(msg.taskId);
            this.validateRecordExists(taskCreate);

            const movieData = await this.hdRezkaService.getMovieData(taskCreate.link);
            const movie = await this.moviesModelService.createMovieExtend(movieData);
            await this.groupsMovieModelService.connectMovie(taskCreate.groupMovie.id, movie);

            if (['loading', 'error'].includes(movie.photo)) {
                try {
                    await this.moviesModelService.updateMoviePhotoById(movie.id, await this.filesService.upload({
                        profileId: -1,
                        bucketName: 'movie',
                        fileName: 'main',
                        fileDir: movie.id.toString(),
                        file: await getImageBufferByLink(movieData.photo)
                    }));
                } catch (e) {
                    await this.moviesModelService.updateMoviePhotoById(movie.id, 'error');
                }
            }

            await this.groupsMovieModelService.closeTaskById(taskCreate.id);
        } catch (e) {
            console.error(e);
            if (taskCreate) await this.groupsMovieModelService.setTaskErrorStatusById(taskCreate.id, true);
        }

        await this.utils.syncWait(this.everyNSeconds * 1000 - (Date.now() - start));
    }

    private validateRecordExists(rec: any) {
        if (!rec) throw new Error("Запись в таблице не найдена");
    }
}
