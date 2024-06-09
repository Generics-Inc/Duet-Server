import {Controller, Post, Query} from '@nestjs/common';
import {HdRezkaService} from "./hdRezka.service";


@Controller('mails')
export class HdRezkaController {
    constructor(private selfService: HdRezkaService) {}

    @Post()
    test() {
        return this.selfService.checkActualMirror();
    }

    @Post('test')
    test2(@Query('name') name?: string) {
        return this.selfService.searchMovies(name ?? '');
    }

    @Post('parse')
    test3(@Query('url') url?: string) {
        return this.selfService.getMovieData(url ?? '');
    }
}
