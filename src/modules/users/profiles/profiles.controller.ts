import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {Profile} from "@prisma/client";
import {UserNotFoundException} from "@root/errors";
import {utils} from "@root/helpers";
import {ProfileDto} from "@modules/usersBase/profilesBase/dto";
import {UserProfile} from "@modules/usersBase/decorator";
import {AccessTokenGuard} from "@modules/auth/guard";
import {UsersProfilesService} from "./profiles.service";
import {GroupStatusDto} from "./dto";
import {UsersProfilesBaseService} from "@modules/usersBase/profilesBase/profilesBase.service";


@ApiTags('Профили')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('profiles')
export class ProfilesController {
    private utils = utils();

    constructor(
        private profilesBaseService: UsersProfilesBaseService,
        private profilesService: UsersProfilesService,
    ) {}

    @ApiOperation({ summary: 'Вывести профиль авторизированного пользователя' })
    @ApiResponse({ type: ProfileDto })
    @Get('me')
    getMyProfile(@UserProfile() profile: Profile) {
        return this.profilesBaseService.getProfileById(profile.id);
    }

    @ApiOperation({ summary: 'Вывести статус активного пользователя' })
    @ApiResponse({ type: GroupStatusDto })
    @Get('status')
    isThereGroup(@UserProfile() profile: Profile) {
        return this.profilesService.statusAboutProfile(profile);
    }

    @ApiOperation({ summary: 'Вывести профиль по ID' })
    @ApiParam({ description: 'ID пользователя', name: 'id', type: Number })
    @ApiResponse({ type: ProfileDto })
    @Get(':id')
    async getUserById(@UserProfile('id') profileId: number, @Param('id', ParseIntPipe) id: number) {
        return this.utils.ifEmptyGivesError(await this.profilesService.getProfileByIdHandler(profileId, id), UserNotFoundException);
    }
}
