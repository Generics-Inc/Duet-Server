import {Module} from '@nestjs/common';
import {MoviesController} from './movies.controller';
import {MoviesService} from './movies.service';
import {MoviesModel} from "@models/movies/movies.model";
import {TasksModule} from "@modules/tasks/tasks.module";
import {FilesModule} from "@modules/files/files.module";
import {GroupsModule} from "@modules/groups/groups.module";
import { MoviesGateway } from './movies.gateway';

@Module({
    imports: [
        GroupsModule,
        MoviesModel,
        TasksModule,
        FilesModule
    ],
    controllers: [
        MoviesController
    ],
    providers: [
        MoviesService,
        MoviesGateway
    ]
})
export class MoviesModule {}
