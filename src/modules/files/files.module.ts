import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {FilesService} from "./files.service";
import {FilesController} from "./files.controller";

@Module({
    providers: [
        FilesService,
        PrismaService
    ],
    controllers: [FilesController],
    exports: [FilesService]
})
export class FilesModule {
}
