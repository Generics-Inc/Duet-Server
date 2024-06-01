import { Injectable } from '@nestjs/common';
import {MoviesSeasonsModelService} from "@models/movies/seasons/seasons.service";

@Injectable()
export class MoviesSeasonsService {
    constructor(private modelService: MoviesSeasonsModelService) {}
}
