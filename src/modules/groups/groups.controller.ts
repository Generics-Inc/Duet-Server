import {Controller, Delete, Get, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Throttle} from "@nestjs/throttler";
import {GroupNotFoundException} from "@root/errors";
import {utils} from "@root/helpers";
import {AccessTokenGuard, OnlyHaveGroupGuard, OnlyNotHaveGroupGuard} from "@modules/auth/guard";
import {PostFile, UploadedPostFile, UploadedPostFileReturn} from "@modules/app/decorators";
import {CreateGroupDto} from "./dto";
import {UserProfile} from "@modules/usersBase/decorator";
import {GroupsService} from "./groups.service";
import {GroupDto, GroupExtendDto} from "@modules/groupsBase/dto";


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

    @ApiOperation({ summary: 'Выйти из активной группы' })
    @ApiResponse({ status: HttpStatus.OK })
    @HttpCode(HttpStatus.OK)
    @Delete('leave')
    @UseGuards(OnlyHaveGroupGuard)
    leaveFromGroup(@UserProfile('id') profileId: number) {
        return this.groupsService.leaveFromGroup(profileId);
    }
}
