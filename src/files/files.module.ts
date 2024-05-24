import {Module} from '@nestjs/common';
import {FilesService} from './files.service';
import {FilesController} from './files.controller';
import {PrismaService} from "../singles";

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
