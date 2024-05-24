import {Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Throttle} from "@nestjs/throttler";
import {GroupNotFoundException} from "@root/errors";
import {utils} from "@root/helpers";
import {GroupDto, GroupExtendDto} from "@models/groups/dto";
import {GroupRequestDto} from "@models/groups/requests/dto";
import {AccessTokenGuard, OnlyHaveGroupGuard, OnlyMainInGroupGuard, OnlyNotHaveGroupGuard} from "@modules/auth/guard";
import {PostFile, UploadedPostFile, UploadedPostFileReturn} from "@modules/app/decorators";
import {UserProfile} from "@modules/users/decorator";
import {GroupsService} from "./groups.service";
import {CreateGroupDto} from "./dto";


@ApiTags('Группы')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups')
export class GroupsController {
    private utils = utils();

    constructor(private groupsService: GroupsService) {}

    @ApiOperation({ summary: 'Вывести активную группу авторизированного пользователя' })
    @ApiResponse({ type: GroupDto })
    @Get('me')
    async getMyGroup(@UserProfile('id') profileId: number) {
        return this.utils.ifEmptyGivesError(await this.groupsService.getGroupByProfileId(profileId), GroupNotFoundException);
    }

    @ApiOperation({ summary: 'Вывести активную группу авторизированного пользователя в расширенном виде' })
    @ApiResponse({ type: GroupExtendDto })
    @Get('me/full')
    async getMyFullGroup(@UserProfile('id') profileId: number) {
        return this.utils.ifEmptyGivesError(await this.groupsService.getGroupByProfileId(profileId, true), GroupNotFoundException);
    }

    @Throttle({ default: { ttl: 10000, limit: 1 }})
    @ApiOperation({ summary: 'Создать группу авторизированного пользователя' })
    @ApiBody({ type: CreateGroupDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: GroupDto })
    @HttpCode(HttpStatus.CREATED)
    @PostFile()
    @UseGuards(OnlyNotHaveGroupGuard)
    createGroup(@UploadedPostFile({
        fileSize: 5 * 1024 ** 2,
        fileType: '.(jpg|jpeg|png)',
        bodyType: CreateGroupDto
    }) form: UploadedPostFileReturn<CreateGroupDto>, @UserProfile('id') profileId: number) {
        return this.groupsService.createGroup(profileId, form);
    }

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

    @ApiOperation({ summary: 'Выйти из активной группы' })
    @ApiResponse({ status: HttpStatus.OK })
    @HttpCode(HttpStatus.OK)
    @Delete('leave')
    @UseGuards(OnlyHaveGroupGuard)
    leaveFromGroup(@UserProfile('id') profileId: number) {
        return this.groupsService.leaveFromGroup(profileId);
    }
}
