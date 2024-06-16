import {Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {GroupNotFoundException} from "@root/errors";
import {utils} from "@root/helpers";
import {GroupModelDto, GroupDto} from "@models/groups/dto";
import {GroupRequestModelDto} from "@models/groups/requests/dto";
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
        return this.utils.ifEmptyGivesError(await this.groupsService.getPreparedByProfileId(profileId), GroupNotFoundException);
    }

    @ApiOperation({ summary: 'Создать группу авторизированного пользователя' })
    @ApiBody({ type: CreateGroupDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: GroupModelDto })
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

    @ApiOperation({ summary: 'Сгенерировать новый inviteCode активной группы' })
    @ApiResponse({ status: HttpStatus.CREATED, type: GroupModelDto })
    @HttpCode(HttpStatus.CREATED)
    @Patch('generateInviteCode')
    @UseGuards(OnlyMainInGroupGuard)
    generateNewInviteCode(@UserProfile('groupId') groupId: number) {
        return this.groupsService.updateInviteCode(groupId);
    }

    @ApiOperation({ summary: 'Отправить запрос на присоединение по коду приглашения' })
    @ApiParam({ description: 'Код приглашения', name: 'inviteCode', type: String })
    @ApiResponse({ status: HttpStatus.CREATED, type: GroupRequestModelDto })
    @HttpCode(HttpStatus.CREATED)
    @Patch('join/:inviteCode')
    @UseGuards(OnlyNotHaveGroupGuard)
    sendRequestToGroup(@UserProfile('id') profileId: number, @Param('inviteCode') inviteCode: string) {
        return this.groupsService.sendRequestToGroup(profileId, inviteCode);
    }

    @ApiOperation({ summary: 'Выгнать приглашенного партнёра из группы и из архива' })
    @ApiResponse({ status: HttpStatus.OK, type: GroupModelDto })
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
