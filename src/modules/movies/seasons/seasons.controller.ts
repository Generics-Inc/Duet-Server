import {Controller, Get, UseGuards} from '@nestjs/common';
import {MoviesSeasonsService} from "@modules/movies/seasons/seasons.service";
import {ApiOperation, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {OnlyHaveGroupGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/users/decorator";


@ApiTags('Раздел "Кинотека"')
@ApiSecurity('AccessToken')
@UseGuards(OnlyHaveGroupGuard)
@Controller('movies/seasons')
export class MoviesSeasonsController {
    constructor(private selfService: MoviesSeasonsService) {}

    @ApiOperation({ summary: 'Вывести все сезоны группы' })
    @Get()
    getAllFromActiveGroup(@UserProfile('groupId') groupId: number) {
        return this.selfService.getModel().getSeasonsByGroupId(groupId)
    }
}
