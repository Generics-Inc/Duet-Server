import {Module} from '@nestjs/common';
import {MoviesController} from './movies.controller';
import {MoviesService} from './movies.service';
import {MoviesModel} from "@models/movies/movies.model";
import {TasksModule} from "@modules/tasks/tasks.module";
import {FilesModule} from "@modules/files/files.module";
import {GroupsModule} from "@modules/groups/groups.module";
import {HdRezkaModule} from "@modules/hdRezka/hdRezka.module";

@Module({
    imports: [
        GroupsModule,
        HdRezkaModule,
        MoviesModel,
        TasksModule,
        FilesModule
    ],
    controllers: [
        MoviesController
    ],
    providers: [
        MoviesService
    ]
})
export class MoviesModule {}
