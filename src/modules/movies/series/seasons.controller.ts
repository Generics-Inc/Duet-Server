import {Controller, UseGuards} from '@nestjs/common';
import {MoviesSeriesService} from "@modules/movies/series/seasons.service";
import {ApiSecurity, ApiTags} from "@nestjs/swagger";
import {OnlyHaveGroupGuard} from "@modules/auth/guard";

@ApiTags('Раздел "Кино"')
@ApiSecurity('AccessToken')
@UseGuards(OnlyHaveGroupGuard)
@Controller('movies/series')
export class MoviesSeriesController {
    constructor(private selfService: MoviesSeriesService) {}
}
