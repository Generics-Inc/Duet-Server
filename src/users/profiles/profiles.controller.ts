import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import {AccessTokenGuard, HaveRoleAccessGuard} from "../../auth/guard";
import useUtils from "../../composables/useUtils";
import {Roles, UserProfile} from "../decorator";
import {Profile, Role} from "@prisma/client";
import {ProfileIncludes} from "../../types";
import {UserNotFoundException} from "../../errors";
import {ProfilesService} from "./profiles.service";
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {ProfileDto, ProfileExtendDto} from "./dto";

@ApiTags('Профили')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('profiles')
export class ProfilesController {
    private utils = useUtils();

    constructor(private profilesService: ProfilesService) {}

    @ApiOperation({ summary: 'ADMIN: Вывести все профили' })
    @ApiResponse({ type: ProfileDto, isArray: true })
    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAll(): Promise<Profile[]> {
        return this.profilesService.getProfiles();
    }

    @ApiOperation({ summary: 'ADMIN: Вывести все профили в расширенном виде' })
    @ApiResponse({ type: ProfileExtendDto, isArray: true })
    @Get('full')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAllFull(): Promise<ProfileIncludes[]> {
        return this.profilesService.getProfiles(true);
    }

    @ApiOperation({ summary: 'Вывести профиль авторизированного пользователя' })
    @ApiResponse({ type: ProfileDto })
    @Get('me')
    getMyProfile(@UserProfile() profile: Profile): Profile {
        return profile;
    }

    @ApiOperation({ summary: 'Вывести профиль авторизированного пользователя в расширенном виде' })
    @ApiResponse({ type: ProfileExtendDto })
    @Get('me/full')
    getMyProfileFull(@UserProfile('id') profileId: number): Promise<ProfileIncludes> {
        return this.profilesService.getProfile({ id: profileId }, true);
    }

    @ApiOperation({ summary: 'Вывести профиль по ID' })
    @ApiParam({ description: 'ID пользователя', name: 'id', type: Number })
    @ApiResponse({ type: ProfileDto })
    @Get(':id')
    async getUserById(@UserProfile('id') profileId: number, @Param('id') id: string): Promise<Profile> {
        this.utils.checkIdCurrent(id);
        return this.utils.ifEmptyGivesError(await this.profilesService.getProfileByIdHandler(profileId, +id), UserNotFoundException);
    }

    @ApiOperation({ summary: 'ADMIN: Вывести профиль по ID в расширенном виде' })
    @ApiParam({ description: 'ID пользователя', name: 'id', type: Number })
    @ApiResponse({ type: ProfileExtendDto })
    @Get(':id/full')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    async getUserFullById(@Param('id') id: string): Promise<ProfileIncludes> {
        this.utils.checkIdCurrent(id);
        return this.utils.ifEmptyGivesError(await this.profilesService.getProfile({ id: +id }, true), UserNotFoundException);
    }
}
