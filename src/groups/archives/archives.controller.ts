import {Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, UseGuards} from '@nestjs/common';
import {AccessTokenGuard, OnlyNotHaveGroupGuard} from "../../auth/guard";
import {GroupsArchivesService} from "./archives.service";
import {UserProfile} from "../../users/decorator";
import useUtils from "../../composables/useUtils";
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {GroupArchiveDto, GroupArchiveExtendDto} from "./dto";
import {GroupDto} from "../dto";

@ApiTags('Корзина')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups/archives')
export class GroupsArchivesController {
    private utils = useUtils();

    constructor(private groupsArchivesService: GroupsArchivesService) {}

    @ApiOperation({ summary: 'Вывести группы из корзины авторизированного пользователя' })
    @ApiResponse({ type: GroupArchiveDto, isArray: true })
    @Get('me')
    getMyArchives(@UserProfile('id') profileId: number) {
        return this.groupsArchivesService.getArchivesByProfileId(profileId);
    }

    @ApiOperation({ summary: 'Вывести группы из корзины авторизированного пользователя в расширенном виде' })
    @ApiResponse({ type: GroupArchiveExtendDto, isArray: true })
    @Get('me/full')
    getMyFullArchives(@UserProfile('id') profileId: number) {
        return this.groupsArchivesService.getArchivesByProfileId(profileId, true);
    }

    @ApiOperation({ summary: 'Восстановить группу из корзины' })
    @ApiParam({ description: 'ID записи в корзине', name: 'id', type: Number })
    @ApiResponse({ status: 200, type: GroupDto })
    @HttpCode(HttpStatus.OK)
    @Patch('revert/:id')
    @UseGuards(OnlyNotHaveGroupGuard)
    revertToGroup(@UserProfile('id') profileId: number, @Param('id') id: string) {
        this.utils.checkIdCurrent(id);
        return this.groupsArchivesService.revertGroupFromArchive(profileId, +id);
    }

    @ApiOperation({ summary: 'Удалить запись из корзины' })
    @ApiParam({ description: 'ID записи в корзине', name: 'id', type: Number })
    @ApiResponse({ status: 200, type: GroupArchiveDto })
    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    deleteArchiveById(@UserProfile('id') profileId: number, @Param('id', ParseIntPipe) id: number) {
        return this.groupsArchivesService.deleteArchiveRecordWithChecks(id, profileId);
    }
}
