import {Module} from '@nestjs/common';
import {UsersModel} from "@models/users/users.model";
import {GroupsModel} from "@models/groups/groups.model";
import {MoviesModel} from "@models/movies/movies.model";
import {FilesService} from "./files.service";
import {FilesController} from "./files.controller";

@Module({
    imports: [
        UsersModel,
        GroupsModel,
        MoviesModel
    ],
    providers: [
        FilesService
    ],
    controllers: [
        FilesController
    ],
    exports: [
        FilesService
    ]
})
export class FilesModule {
}
