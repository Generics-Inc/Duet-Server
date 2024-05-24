import {Controller, Delete, HttpCode, HttpStatus, Param, Patch, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Throttle} from "@nestjs/throttler";
import {AccessTokenGuard, OnlyMainInGroupGuard, OnlyNotHaveGroupGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/usersBase/decorator";
import {GroupDto} from "./dto";
import {GroupsBaseService} from "./groupsBase.service";
import {GroupRequestDto} from "./requestsBase/dto";

@ApiTags('Группы')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups')
export class GroupsBaseController {
    constructor(private groupsService: GroupsBaseService) {}

    @Throttle({ default: { ttl: 10000, limit: 1 }})
    @ApiOperation({ summary: 'Сгенерировать новый inviteCode активной группы' })
    @ApiResponse({ status: HttpStatus.CREATED, type: GroupDto })
    @HttpCode(HttpStatus.CREATED)
    @Patch('generateInviteCode')
    @UseGuards(OnlyMainInGroupGuard)
    generateNewInviteCode(@UserProfile('groupId') groupId: number) {
        return this.groupsService.updateInviteCode(groupId);
    }

    @Throttle({ default: { ttl: 10000, limit: 1 }})
    @ApiOperation({ summary: 'Отправить запрос на присоединение по коду приглашения' })
    @ApiParam({ description: 'Код приглашения', name: 'inviteCode', type: String })
    @ApiResponse({ status: HttpStatus.CREATED, type: GroupRequestDto })
    @HttpCode(HttpStatus.CREATED)
    @Patch('join/:inviteCode')
    @UseGuards(OnlyNotHaveGroupGuard)
    sendRequestToGroup(@UserProfile('id') profileId: number, @Param('inviteCode') inviteCode: string) {
        return this.groupsService.sendRequestToGroup(profileId, inviteCode);
    }

    @ApiOperation({ summary: 'Выгнать приглашенного партнёра из группы' })
    @ApiResponse({ status: HttpStatus.OK })
    @HttpCode(HttpStatus.OK)
    @Delete('kickPartner')
    @UseGuards(OnlyMainInGroupGuard)
    kickPartnerFromGroup(@UserProfile('groupId') groupId: number) {
        return this.groupsService.kickSecondPartnerFromGroup(groupId);
    }
}
