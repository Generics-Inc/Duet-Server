import {Controller, Delete, Get, Param, Patch, UseGuards} from '@nestjs/common';
import {AccessTokenGuard, HaveRoleAccessGuard, OnlyNotHaveGroupGuard} from "../../auth/guard";
import {Group, GroupArchive, Role} from "@prisma/client";
import {Roles} from "../../users/decorator/roles.decorator";
import {GroupsArchiveService} from "./archive.service";
import {GroupArchiveIncludes} from "../../types";
import {UserProfile} from "../../users/decorator/user-profile.decorator";
import useUtils from "../../composables/useUtils";


@UseGuards(AccessTokenGuard)
@Controller('groups/archive')
export class GroupsArchiveController {
    private utils = useUtils();

    constructor(private groupsArchiveService: GroupsArchiveService) {}

    @Get('')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAllArchive(): Promise<GroupArchive[]> {
        return this.groupsArchiveService.getAllArchive();
    }
    @Get('full')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAllFullArchive(): Promise<GroupArchiveIncludes[]> {
        return this.groupsArchiveService.getAllArchive(true);
    }

    @Get('me')
    getMyArchive(@UserProfile('id') profileId: number): Promise<GroupArchive[]> {
        return this.groupsArchiveService.getArchiveByProfileId(profileId);
    }
    @Get('me/full')
    getMyFullArchive(@UserProfile('id') profileId: number): Promise<GroupArchiveIncludes[]> {
        return this.groupsArchiveService.getArchiveByProfileId(profileId, true);
    }

    @Patch('revert/:id')
    @UseGuards(OnlyNotHaveGroupGuard)
    revertToGroup(@UserProfile('id') profileId: number, @Param('id') id: string): Promise<Group> {
        this.utils.checkIdCurrent(id);
        return this.groupsArchiveService.revertGroupFromArchive(profileId, +id);
    }
    @Delete(':id')
    deleteArchiveById(@UserProfile('id') userId: number, @Param('id') id: string): Promise<GroupArchive> {
        this.utils.checkIdCurrent(id);
        return this.groupsArchiveService.deleteArchiveRecordById(+id, userId);
    }
}
