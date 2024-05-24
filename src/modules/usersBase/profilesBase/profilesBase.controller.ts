import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {UserNotFoundException} from "@root/errors";
import {Profile} from "@prisma/client";
import {utils} from "@root/helpers";
import {ProfilesBaseService} from "@modules/usersBase/profilesBase/profilesBase.service";
import {AccessTokenGuard} from "@modules/auth/guard";
import {UserProfile} from "../decorator";
import {ProfileDto} from "./dto";


@ApiTags('Профили')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('profiles')
export class ProfilesBaseController {
    private utils = utils();

    constructor(private profilesService: ProfilesBaseService) {}

    @ApiOperation({ summary: 'Вывести профиль авторизированного пользователя' })
    @ApiResponse({ type: ProfileDto })
    @Get('me')
    getMyProfile(@UserProfile() profile: Profile) {
        return this.profilesService.getProfileById(profile.id);
    }

    @ApiOperation({ summary: 'Вывести профиль по ID' })
    @ApiParam({ description: 'ID пользователя', name: 'id', type: Number })
    @ApiResponse({ type: ProfileDto })
    @Get(':id')
    async getUserById(@UserProfile('id') profileId: number, @Param('id', ParseIntPipe) id: number) {
        return this.utils.ifEmptyGivesError(await this.profilesService.getProfileByIdHandler(profileId, id), UserNotFoundException);
    }
}
