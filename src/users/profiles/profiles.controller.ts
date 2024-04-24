import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import {AccessTokenGuard, HaveRoleAccessGuard} from "../../auth/guard";
import useUtils from "../../composables/useUtils";
import {Roles, UserProfile} from "../decorator";
import {Profile, Role} from "@prisma/client";
import {ProfileIncludes} from "../../types";
import {UserNotFoundException} from "../../errors";
import {ProfilesService} from "./profiles.service";


@Controller('profiles')
export class ProfilesController {
    private utils = useUtils();

    constructor(private profilesService: ProfilesService) {}

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAll(): Promise<Profile[]> {
        return this.profilesService.getProfiles();
    }
    @Get('full')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAllFull(): Promise<ProfileIncludes[]> {
        return this.profilesService.getProfiles(true);
    }

    @Get('me')
    @UseGuards(AccessTokenGuard)
    getMyProfile(@UserProfile() profile: Profile): Profile {
        return profile;
    }
    @Get('me/full')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getMyProfileFull(@UserProfile('id') profileId: number): Promise<ProfileIncludes> {
        return this.profilesService.getProfile({ id: profileId }, true);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    async getUserById(@UserProfile('id') profileId: number, @Param('id') id: string): Promise<Profile> {
        this.utils.checkIdCurrent(id);
        return this.utils.ifEmptyGivesError(await this.profilesService.getProfileByIdHandler(profileId, +id), UserNotFoundException);
    }
    @Get(':id/full')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    async getUserFullById(@Param('id') id: string): Promise<ProfileIncludes> {
        this.utils.checkIdCurrent(id);
        return this.utils.ifEmptyGivesError(await this.profilesService.getProfile({ id: +id }, true), UserNotFoundException);
    }
}
