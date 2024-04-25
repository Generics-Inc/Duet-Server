import {Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {GroupsService} from "./groups.service";
import {
    AccessTokenGuard,
    HaveRoleAccessGuard,
    OnlyHaveGroupGuard,
    OnlyNotHaveGroupGuard
} from "../auth/guard";
import {StatusDto} from "../globalDto";
import {Group, Role} from "@prisma/client";
import {
    UserProfile,
    Roles
} from "../users/decorator";
import useUtils from "../composables/useUtils";
import {GroupNotFoundException} from "../errors";
import {GroupIncludes} from "../types";
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {GroupDto, GroupExtendDto} from "./dto";

@ApiTags('Группы')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups')
export class GroupsController {
    private utils = useUtils();

    constructor(private groupsService: GroupsService) {}

    @ApiOperation({ summary: 'Проверить есть ли активная группа' })
    @ApiResponse({ type: StatusDto })
    @Get('isThereGroup')
    async isThereGroup(@UserProfile('id') profileId: number): Promise<StatusDto> {
        return await this.groupsService.isThereGroupByProfileId(profileId);
    }

    @ApiOperation({ summary: 'ADMIN: Вывести все активные группы пользователей' })
    @ApiResponse({ type: GroupDto, isArray: true })
    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAllGroups(): Promise<Group[]> {
        return this.groupsService.getAllGroups();
    }

    @ApiOperation({ summary: 'ADMIN: Вывести все активные группы пользователей в расширенном виде' })
    @ApiResponse({ type: GroupExtendDto, isArray: true })
    @Get('full')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAllFullGroups(): Promise<GroupIncludes[]> {
        return this.groupsService.getAllGroups(true);
    }

    @ApiOperation({ summary: 'Вывести активную группу авторизированного пользователя' })
    @ApiResponse({ type: GroupDto })
    @Get('me')
    async getMyGroup(@UserProfile('id') profileId: number): Promise<Group> {
        return this.utils.ifEmptyGivesError(await this.groupsService.getGroupByProfileId(profileId), GroupNotFoundException);
    }

    @ApiOperation({ summary: 'Вывести активную группу авторизированного пользователя в расширенном виде' })
    @ApiResponse({ type: GroupExtendDto })
    @Get('me/full')
    async getMyFullGroup(@UserProfile('id') profileId: number): Promise<GroupIncludes> {
        return this.utils.ifEmptyGivesError(await this.groupsService.getGroupByProfileId(profileId, true), GroupNotFoundException);
    }

    @ApiOperation({ summary: 'Создать группу авторизированного пользователя' })
    @ApiResponse({ status: 201, type: GroupDto })
    @HttpCode(HttpStatus.CREATED)
    @Post()
    @UseGuards(OnlyNotHaveGroupGuard)
    async createGroup(@UserProfile('id') profileId: number): Promise<Group> {
        return await this.groupsService.createGroup(profileId);
    }

    @ApiOperation({ summary: 'Присоединиться к группе по коду приглашения' })
    @ApiParam({ description: 'Код приглашения', name: 'inviteCode', type: String })
    @ApiResponse({ status: 202, type: GroupDto })
    @HttpCode(HttpStatus.ACCEPTED)
    @Patch('join/:inviteCode')
    @UseGuards(OnlyNotHaveGroupGuard)
    async joinToGroup(@UserProfile('id') profileId: number, @Param('inviteCode') inviteCode: string): Promise<Group> {
        return await this.groupsService.joinToGroup(profileId, inviteCode);
    }

    @ApiOperation({ summary: 'Выйти из активной группы' })
    @ApiResponse({ status: 200, type: GroupExtendDto })
    @HttpCode(HttpStatus.OK)
    @Patch('leave')
    @UseGuards(OnlyHaveGroupGuard)
    async leaveFromGroup(@UserProfile('id') profileId: number): Promise<GroupIncludes> {
        return await this.groupsService.leaveFromGroup(profileId);
    }
}
