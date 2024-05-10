import {Controller, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {AccessTokenGuard} from "../../auth/guard";
import useUtils from "../../composables/useUtils";
import {UserProfile} from "../decorator";
import {Profile} from "@prisma/client";
import {UserNotFoundException} from "../../errors";
import {ProfilesService} from "./profiles.service";
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {GroupStatusDto, ProfileDto} from "./dto";

@ApiTags('Профили')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('profiles')
export class ProfilesController {
    private utils = useUtils();

    constructor(private profilesService: ProfilesService) {}

    @ApiOperation({ summary: 'Вывести статус активного пользователя' })
    @ApiResponse({ type: GroupStatusDto })
    @Get('status')
    isThereGroup(@UserProfile() profile: Profile) {
        return this.profilesService.statusAboutProfile(profile);
    }

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
