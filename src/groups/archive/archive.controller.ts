import {Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, UseGuards} from '@nestjs/common';
import {AccessTokenGuard, HaveRoleAccessGuard, OnlyNotHaveGroupGuard} from "../../auth/guard";
import {Group, GroupArchive, Role} from "@prisma/client";
import {GroupsArchiveService} from "./archive.service";
import {GroupArchiveIncludes} from "../../types";
import {UserProfile, Roles} from "../../users/decorator";
import useUtils from "../../composables/useUtils";
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {GroupArchiveDto} from "./dto";
import {GroupArchiveExtendDto} from "./dto/group-archive-extend.dto";
import {GroupDto} from "../dto";

@ApiTags('Корзина')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups/archive')
export class GroupsArchiveController {
    private utils = useUtils();

    constructor(private groupsArchiveService: GroupsArchiveService) {}

    @ApiOperation({ summary: 'ADMIN: Вывести группы из корзины всех пользователей' })
    @ApiResponse({ type: GroupArchiveDto, isArray: true })
    @Get('')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAllArchive(): Promise<GroupArchive[]> {
        return this.groupsArchiveService.getAllArchive();
    }

    @ApiOperation({ summary: 'ADMIN: Вывести группы из корзины всех пользователей в расширенном виде' })
    @ApiResponse({ type: GroupArchiveExtendDto, isArray: true })
    @Get('full')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAllFullArchive(): Promise<GroupArchiveIncludes[]> {
        return this.groupsArchiveService.getAllArchive(true);
    }

    @ApiOperation({ summary: 'Вывести группы из корзины авторизированного пользователя' })
    @ApiResponse({ type: GroupArchiveDto, isArray: true })
    @Get('me')
    getMyArchive(@UserProfile('id') profileId: number): Promise<GroupArchive[]> {
        return this.groupsArchiveService.getArchiveByProfileId(profileId);
    }

    @ApiOperation({ summary: 'Вывести группы из корзины авторизированного пользователя в расширенном виде' })
    @ApiResponse({ type: GroupArchiveExtendDto, isArray: true })
    @Get('me/full')
    getMyFullArchive(@UserProfile('id') profileId: number): Promise<GroupArchiveIncludes[]> {
        return this.groupsArchiveService.getArchiveByProfileId(profileId, true);
    }

    @ApiOperation({ summary: 'Восстановить группу из корзины' })
    @ApiParam({ description: 'ID записи в корзине', name: 'id', type: Number })
    @ApiResponse({ status: 200, type: GroupDto })
    @HttpCode(HttpStatus.OK)
    @Patch('revert/:id')
    @UseGuards(OnlyNotHaveGroupGuard)
    revertToGroup(@UserProfile('id') profileId: number, @Param('id') id: string): Promise<Group> {
        this.utils.checkIdCurrent(id);
        return this.groupsArchiveService.revertGroupFromArchive(profileId, +id);
    }

    @ApiOperation({ summary: 'Удалить запись из корзины' })
    @ApiParam({ description: 'ID записи в корзине', name: 'id', type: Number })
    @ApiResponse({ status: 200, type: GroupArchiveDto })
    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    deleteArchiveById(@UserProfile('id') userId: number, @Param('id') id: string): Promise<GroupArchive> {
        this.utils.checkIdCurrent(id);
        return this.groupsArchiveService.deleteArchiveRecordById(+id, userId);
    }
}
