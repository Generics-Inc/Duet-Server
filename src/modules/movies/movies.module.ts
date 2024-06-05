import {Module} from '@nestjs/common';
import {MoviesController} from './movies.controller';
import {MoviesService} from './movies.service';
import {MoviesModel} from "@models/movies/movies.model";
import {MoviesSeasonsController} from "@modules/movies/seasons/seasons.controller";
import {MoviesSeriesController} from "@modules/movies/series/series.controller";
import {MoviesSeasonsService} from "@modules/movies/seasons/seasons.service";
import {MoviesSeriesService} from "@modules/movies/series/series.service";
import {MoviesTagsController} from "@modules/movies/tags/tags.controller";
import {MoviesTagsService} from "@modules/movies/tags/tags.service";
import {HttpModule} from "@nestjs/axios";
import {TasksModule} from "@modules/tasks/tasks.module";
import {FilesModule} from "@modules/files/files.module";

@Module({
    imports: [
        MoviesModel,
        TasksModule,
        FilesModule,
        HttpModule
    ],
    controllers: [
        MoviesSeasonsController,
        MoviesSeriesController,
        MoviesTagsController,
        MoviesController
    ],
    providers: [
        MoviesSeasonsService,
        MoviesSeriesService,
        MoviesTagsService,
        MoviesService
    ]
})
export class MoviesModule {}
