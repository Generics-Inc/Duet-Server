import { Injectable } from '@nestjs/common';
import {MoviesTagsModelService} from "@models/movies/tags/tags.service";

@Injectable()
export class MoviesTagsService {
    constructor(private modelService: MoviesTagsModelService) {}

    getModel() {
        return this.modelService;
    }
}
