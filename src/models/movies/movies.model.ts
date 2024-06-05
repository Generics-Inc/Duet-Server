import {Module} from '@nestjs/common';
import {MoviesSeasonsModelService} from "./seasons/seasons.service";
import {MoviesSeriesModelService} from "./series/series.service";
import {MoviesModelService} from './movies.service';
import {MoviesTagsModelService} from "@models/movies/tags/tags.service";

@Module({
    providers: [
        MoviesModelService,
        MoviesSeasonsModelService,
        MoviesSeriesModelService,
        MoviesTagsModelService
    ],
    exports: [
        MoviesModelService,
        MoviesSeasonsModelService,
        MoviesSeriesModelService,
        MoviesTagsModelService
    ]
})
export class MoviesModel {}
