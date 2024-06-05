import {Module} from '@nestjs/common';
import {SearcherService} from './searcher.service';
import {HttpModule} from "@nestjs/axios";
import {ConfigModule} from "@nestjs/config";


@Module({
    imports: [
        HttpModule,
        ConfigModule
    ],
    providers: [
        SearcherService
    ],
    exports: [
        SearcherService
    ]
})
export class SearcherModule {
}
