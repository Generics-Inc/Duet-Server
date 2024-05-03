import {Controller, Get, HttpCode, HttpStatus, Param, Patch, UseGuards} from '@nestjs/common';
import {GroupsService} from "./groups.service";
import {
    AccessTokenGuard,
    OnlyHaveGroupGuard,
    OnlyNotHaveGroupGuard
} from "../auth/guard";
import {
    UserProfile
} from "../users/decorator";
import useUtils from "../composables/useUtils";
import {GroupNotFoundException} from "../errors";
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {CreateGroupDto, GroupDto, GroupExtendDto} from "./dto";
import {PostFile, UploadedPostFile, UploadedPostFileReturn} from "../app/decorators";
import {GroupRequestDto} from "./requests/dto";
import {Throttle} from "@nestjs/throttler";

@ApiTags('Группы')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups')
export class GroupsController {
    private utils = useUtils();

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

    @Throttle({ default: { ttl: 15000, limit: 1 }})
    @ApiOperation({ summary: 'Создать группу авторизированного пользователя' })
    @ApiBody({ type: CreateGroupDto })
    @ApiResponse({ status: 201, type: GroupDto })
    @HttpCode(HttpStatus.CREATED)
    @PostFile()
    @UseGuards(OnlyNotHaveGroupGuard)
    async createGroup(@UploadedPostFile({
        fileSize: 5 * 1024 ** 2,
        fileType: '.(jpg|jpeg|png)',
        bodyType: CreateGroupDto
    }) form: UploadedPostFileReturn<CreateGroupDto>, @UserProfile('id') profileId: number) {
        return await this.groupsService.createGroup(profileId, form);
    }

    @Throttle({ default: { ttl: 15000, limit: 1 }})
    @ApiOperation({ summary: 'Отправить запрос на присоединение по коду приглашения' })
    @ApiParam({ description: 'Код приглашения', name: 'inviteCode', type: String })
    @ApiResponse({ status: 201, type: GroupRequestDto })
    @HttpCode(HttpStatus.CREATED)
    @Patch('join/:inviteCode')
    @UseGuards(OnlyNotHaveGroupGuard)
    sendRequestToGroup(@UserProfile('id') profileId: number, @Param('inviteCode') inviteCode: string) {
        return this.groupsService.sendRequestToGroup(profileId, inviteCode);
    }

    @ApiOperation({ summary: 'Выйти из активной группы' })
    @ApiResponse({ status: 200, type: GroupExtendDto })
    @HttpCode(HttpStatus.OK)
    @Patch('leave')
    @UseGuards(OnlyHaveGroupGuard)
    async leaveFromGroup(@UserProfile('id') profileId: number) {
        return await this.groupsService.leaveFromGroup(profileId);
    }
}
