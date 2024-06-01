import { Injectable } from '@nestjs/common';
import {MoviesSeriesModelService} from "@models/movies/series/series.service";

@Injectable()
export class MoviesSeriesService {
    constructor(private modelService: MoviesSeriesModelService) {}
}
