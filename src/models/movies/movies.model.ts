import {Module} from '@nestjs/common';
import {MoviesModelService} from './movies.service';

@Module({
    providers: [
        MoviesModelService
    ],
    exports: [
        MoviesModelService
    ]
})
export class MoviesModel {}
