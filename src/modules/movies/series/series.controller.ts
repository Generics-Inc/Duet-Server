import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiSecurity, ApiTags} from "@nestjs/swagger";
import {MoviesSeriesService} from "@modules/movies/series/series.service";
import {OnlyHaveGroupGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/users/decorator";

@ApiTags('Раздел "Кино"')
@ApiSecurity('AccessToken')
@UseGuards(OnlyHaveGroupGuard)
@Controller('movies/series')
export class MoviesSeriesController {
    constructor(private selfService: MoviesSeriesService) {}

    @Get()
    getAllFromActiveGroup(@UserProfile('groupId') groupId: number) {
        return this.selfService.getModel().getSeriesByGroupId(groupId)
    }
}
