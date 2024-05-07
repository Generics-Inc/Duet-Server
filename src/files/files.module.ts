import {Module} from '@nestjs/common';
import {FilesService} from './files.service';
import {FilesController} from './files.controller';
import {UsersModule} from "../users/users.module";

@Module({
    imports: [
        UsersModule
    ],
    providers: [FilesService],
    controllers: [FilesController],
    exports: [FilesService]
})
export class FilesModule {
}
