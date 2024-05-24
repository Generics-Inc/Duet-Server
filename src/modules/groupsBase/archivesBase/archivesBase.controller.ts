import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {AccessTokenGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/usersBase/decorator";
import {GroupsArchivesBaseService} from "./archivesBase.service";
import {GroupArchiveDto, GroupArchiveExtendDto} from "./dto";

@ApiTags('Корзина')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups/archives')
export class GroupsArchivesBaseController {
    constructor(private groupsArchivesBaseService: GroupsArchivesBaseService) {}

    @ApiOperation({ summary: 'Вывести группы из корзины авторизированного пользователя' })
    @ApiResponse({ type: GroupArchiveDto, isArray: true })
    @Get('me')
    getMyArchives(@UserProfile('id') profileId: number) {
        return this.groupsArchivesBaseService.getArchivesByProfileId(profileId);
    }

    @ApiOperation({ summary: 'Вывести группы из корзины авторизированного пользователя в расширенном виде' })
    @ApiResponse({ type: GroupArchiveExtendDto, isArray: true })
    @Get('me/full')
    getMyFullArchives(@UserProfile('id') profileId: number) {
        return this.groupsArchivesBaseService.getArchivesByProfileId(profileId, true);
    }
}
