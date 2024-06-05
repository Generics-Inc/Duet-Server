import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiSecurity, ApiTags} from "@nestjs/swagger";
import {OnlyHaveGroupGuard} from "@modules/auth/guard";
import {MoviesTagsService} from "@modules/movies/tags/tags.service";
import {UserProfile} from "@modules/users/decorator";

@ApiTags('Раздел "Кино"')
@ApiSecurity('AccessToken')
@UseGuards(OnlyHaveGroupGuard)
@Controller('movies/tags')
export class MoviesTagsController {
    constructor(private selfService: MoviesTagsService) {}

    @Get()
    getAllFromActiveGroup(@UserProfile('groupId') groupId: number) {
        return this.selfService.getModel().getTagsByGroupId(groupId)
    }
}
