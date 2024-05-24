import {Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {AccessTokenGuard, OnlyNotHaveGroupGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/users/decorator";
import {utils} from "@root/helpers";
import {GroupDto} from "../dto";
import {GroupsArchivesService} from "./archives.service";
import {GroupArchiveDto, GroupArchiveExtendDto} from "./dto";

@ApiTags('Корзина')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups/archives')
export class GroupsArchivesController {
    private utils = utils();

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
