import {Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {utils} from "@root/helpers";
import {GroupsArchivesService} from "@modules/groups/archives/archives.service";
import {AccessTokenGuard, OnlyNotHaveGroupGuard} from "@modules/auth/guard";
import {GroupArchiveDto} from "@modules/groupsBase/archivesBase/dto";
import {UserProfile} from "@modules/usersBase/decorator";
import {GroupDto} from "@modules/groupsBase/dto";

@ApiTags('Корзина')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups/archives')
export class GroupsArchivesController {
    private utils = utils();

    constructor(private groupsArchivesService: GroupsArchivesService) {}

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
