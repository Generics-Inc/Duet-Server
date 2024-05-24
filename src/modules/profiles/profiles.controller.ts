import {ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Controller, Get, UseGuards} from '@nestjs/common';
import {Profile} from "@prisma/client";
import {AccessTokenGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/usersBase/decorator";
import {ProfilesService} from "./profiles.service";
import {GroupStatusDto} from "./dto";


@ApiTags('Профили')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('profiles')
export class ProfilesController {
    constructor(private usersService: ProfilesService) {}

    @ApiOperation({ summary: 'Вывести статус активного пользователя' })
    @ApiResponse({ type: GroupStatusDto })
    @Get('status')
    isThereGroup(@UserProfile() profile: Profile) {
        return this.usersService.statusAboutProfile(profile);
    }
}
