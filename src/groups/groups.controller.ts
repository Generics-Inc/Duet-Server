import {Controller, Get, HttpCode, HttpStatus, Param, Patch, UseGuards} from '@nestjs/common';
import {GroupsService} from "./groups.service";
import {
    AccessTokenGuard,
    OnlyHaveGroupGuard,
    OnlyNotHaveGroupGuard
} from "../auth/guard";
import {StatusDto} from "../globalDto";
import {Group} from "@prisma/client";
import {
    UserProfile
} from "../users/decorator";
import useUtils from "../composables/useUtils";
import {GroupNotFoundException} from "../errors";
import {GroupIncludes} from "../types";
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {CreateGroupDto, GroupDto, GroupExtendDto} from "./dto";
import {PostFile, UploadedPostFile, UploadedPostFileReturn} from "../app/decorators";

@ApiTags('Группы')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups')
export class GroupsController {
    private utils = useUtils();

    constructor(private groupsService: GroupsService) {}

    @ApiOperation({ summary: 'Проверить есть ли активная группа' })
    @ApiResponse({ type: StatusDto })
    @Get('isThereGroup')
    async isThereGroup(@UserProfile('id') profileId: number): Promise<StatusDto> {
        return await this.groupsService.isThereGroupByProfileId(profileId);
    }

    @ApiOperation({ summary: 'Вывести активную группу авторизированного пользователя' })
    @ApiResponse({ type: GroupDto })
    @Get('me')
    async getMyGroup(@UserProfile('id') profileId: number): Promise<Group> {
        return this.utils.ifEmptyGivesError(await this.groupsService.getGroupByProfileId(profileId), GroupNotFoundException);
    }

    @ApiOperation({ summary: 'Вывести активную группу авторизированного пользователя в расширенном виде' })
    @ApiResponse({ type: GroupExtendDto })
    @Get('me/full')
    async getMyFullGroup(@UserProfile('id') profileId: number): Promise<GroupIncludes> {
        return this.utils.ifEmptyGivesError(await this.groupsService.getGroupByProfileId(profileId, true), GroupNotFoundException);
    }

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

    @ApiOperation({ summary: 'Отправить запрос на присоединение по коду приглашения' })
    @ApiParam({ description: 'Код приглашения', name: 'inviteCode', type: String })
    @ApiResponse({ status: 202, type: GroupDto })
    @HttpCode(HttpStatus.ACCEPTED)
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
    async leaveFromGroup(@UserProfile('id') profileId: number): Promise<GroupIncludes> {
        return await this.groupsService.leaveFromGroup(profileId);
    }
}
