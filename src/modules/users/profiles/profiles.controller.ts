import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {Profile} from "@prisma/client";
import {UserNotFoundException} from "@root/errors";
import {utils} from "@root/helpers";
import {ProfileDto} from "@models/users/profiles/dto";
import {AccessTokenGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/users/decorator";
import {UsersProfilesService} from "./profiles.service";
import {GroupStatusDto} from "./dto";


@ApiTags('Профили')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('profiles')
export class ProfilesController {
    private utils = utils();

    constructor(private usersProfilesService: UsersProfilesService) {}

    @ApiOperation({ summary: 'Вывести профиль авторизированного пользователя' })
    @ApiResponse({ type: ProfileDto })
    @Get('me')
    getMyProfile(@UserProfile() profile: Profile) {
        return this.usersProfilesService.getBase().getProfileById(profile.id);
    }

    @ApiOperation({ summary: 'Вывести статус активного пользователя' })
    @ApiResponse({ type: GroupStatusDto })
    @Get('status')
    isThereGroup(@UserProfile() profile: Profile) {
        return this.usersProfilesService.statusAboutProfile(profile);
    }

    @ApiOperation({ summary: 'Вывести профиль по ID' })
    @ApiParam({ description: 'ID пользователя', name: 'id', type: Number })
    @ApiResponse({ type: ProfileDto })
    @Get(':id')
    async getUserById(@UserProfile('id') profileId: number, @Param('id', ParseIntPipe) id: number) {
        return this.utils.ifEmptyGivesError(await this.usersProfilesService.getProfileById(profileId, id), UserNotFoundException);
    }
}
