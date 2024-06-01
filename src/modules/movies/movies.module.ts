import {Module} from '@nestjs/common';
import {MoviesController} from './movies.controller';
import {MoviesService} from './movies.service';
import {MoviesModel} from "@models/movies/movies.model";
import {MoviesSeasonsController} from "@modules/movies/seasons/seasons.controller";
import {MoviesSeriesController} from "@modules/movies/series/seasons.controller";
import {MoviesSeasonsService} from "@modules/movies/seasons/seasons.service";
import {MoviesSeriesService} from "@modules/movies/series/seasons.service";
import {MoviesTagsController} from "@modules/movies/tags/tags.controller";
import {MoviesTagsService} from "@modules/movies/tags/tags.service";

@Module({
    imports: [
        MoviesModel
    ],
    controllers: [
        MoviesController,
        MoviesSeasonsController,
        MoviesSeriesController,
        MoviesTagsController
    ],
    providers: [
        MoviesService,
        MoviesSeasonsService,
        MoviesSeriesService,
        MoviesTagsService
    ]
})
export class MoviesModule {}
