import {Controller, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {GroupsService} from "./groups.service";
import {AccessTokenGuard, HaveRoleAccessGuard, OnlyHaveGroupGuard, OnlyNotHaveGroupGuard} from "../auth/guard";
import {StatusDto} from "../globalDto";
import {Group, Role} from "@prisma/client";
import {UserProfile} from "../users/decorator/user-profile.decorator";
import useUtils from "../composables/useUtils";
import {GroupNotFoundException} from "../errors";
import {Roles} from "../users/decorator/roles.decorator";
import {GroupIncludes} from "../types";


@UseGuards(AccessTokenGuard)
@Controller('groups')
export class GroupsController {
    private utils = useUtils();

    constructor(private groupsService: GroupsService) {}

    @Get('isThereGroup')
    async isThereGroup(@UserProfile('id') profileId: number): Promise<StatusDto> {
        return await this.groupsService.isThereGroupByProfileId(profileId);
    }

    @Get('')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAllGroups(): Promise<Group[]> {
        return this.groupsService.getAllGroups();
    }
    @Get('full')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAllFullGroups(): Promise<GroupIncludes[]> {
        return this.groupsService.getAllGroups(true);
    }

    @Get('me')
    async getMyGroup(@UserProfile('id') profileId: number): Promise<Group> {
        return this.utils.ifEmptyGivesError(await this.groupsService.getGroupByProfileId(profileId), GroupNotFoundException);
    }
    @Get('me/full')
    async getMyFullGroup(@UserProfile('id') profileId: number): Promise<GroupIncludes> {
        return this.utils.ifEmptyGivesError(await this.groupsService.getGroupByProfileId(profileId, true), GroupNotFoundException);
    }

    @Post()
    @UseGuards(OnlyNotHaveGroupGuard)
    async createGroup(@UserProfile('id') profileId: number): Promise<Group> {
        return await this.groupsService.createGroup(profileId);
    }
    @Patch('join/:inviteCode')
    @UseGuards(OnlyNotHaveGroupGuard)
    async joinToGroup(@UserProfile('id') profileId: number, @Param('inviteCode') inviteCode: string): Promise<Group> {
        return await this.groupsService.joinToGroup(profileId, inviteCode);
    }
    @Patch('leave')
    @UseGuards(OnlyHaveGroupGuard)
    async leaveFromGroup(@UserProfile('id') profileId: number) {
        return await this.groupsService.leaveFromGroup(profileId);
    }
}
