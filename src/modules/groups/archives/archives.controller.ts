import {Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {utils} from "@root/helpers";
import {GroupArchiveDto, GroupArchiveExtendDto} from "@models/groups/archives/dto";
import {GroupDto} from "@models/groups/dto";
import {GroupsArchivesService} from "@modules/groups/archives/archives.service";
import {AccessTokenGuard, OnlyNotHaveGroupGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/users/decorator";

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
        return this.groupsArchivesService.getBase().getArchivesByProfileId(profileId);
    }

    @ApiOperation({ summary: 'Вывести группы из корзины авторизированного пользователя в расширенном виде' })
    @ApiResponse({ type: GroupArchiveExtendDto, isArray: true })
    @Get('me/full')
    getMyFullArchives(@UserProfile('id') profileId: number) {
        return this.groupsArchivesService.getBase().getArchivesByProfileId(profileId, true);
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
