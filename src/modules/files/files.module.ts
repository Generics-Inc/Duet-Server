import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {GroupsBaseModule} from "@modules/groupsBase/groupsBase.module";
import {UsersBaseModule} from "@modules/usersBase/usersBase.module";
import {FilesService} from "./files.service";
import {FilesController} from "./files.controller";

@Module({
    imports: [
        UsersBaseModule,
        GroupsBaseModule
    ],
    providers: [
        FilesService,
        PrismaService
    ],
    controllers: [FilesController],
    exports: [FilesService]
})
export class FilesModule {
}
