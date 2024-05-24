import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {UsersModel} from "@models/users/users.model";
import {GroupsModel} from "@models/groups/groups.model";
import {FilesService} from "./files.service";
import {FilesController} from "./files.controller";

@Module({
    imports: [
        UsersModel,
        GroupsModel
    ],
    providers: [
        FilesService,
        PrismaService
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
