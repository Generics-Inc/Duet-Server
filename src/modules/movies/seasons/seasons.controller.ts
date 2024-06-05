import {Controller, Get, UseGuards} from '@nestjs/common';
import {MoviesSeasonsService} from "@modules/movies/seasons/seasons.service";
import {ApiSecurity, ApiTags} from "@nestjs/swagger";
import {OnlyHaveGroupGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/users/decorator";

@ApiTags('Раздел "Кино"')
@ApiSecurity('AccessToken')
@UseGuards(OnlyHaveGroupGuard)
@Controller('movies/seasons')
export class MoviesSeasonsController {
    constructor(private selfService: MoviesSeasonsService) {}

    @Get()
    getAllFromActiveGroup(@UserProfile('groupId') groupId: number) {
        return this.selfService.getModel().getSeasonsByGroupId(groupId)
    }
}
