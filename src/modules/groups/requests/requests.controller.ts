import {Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {GroupRequestDto, GroupRequestSecureExtendDto} from "@modules/groupsBase/requestsBase/dto";
import {GroupsRequestsBaseService} from "@modules/groupsBase/requestsBase/requestsBase.service";
import {AccessTokenGuard, OnlyHaveGroupGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/usersBase/decorator";
import {GroupDto} from "@modules/groupsBase/dto";
import {GroupsRequestsService} from "@modules/groups/requests/requests.service";


@ApiTags('Запросы вступления в группы')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups/requests')
export class GroupsRequestsController {
    constructor(
        private groupsRequestsService: GroupsRequestsService,
        private groupsRequestsBaseService: GroupsRequestsBaseService
    ) {}

    @ApiOperation({ summary: 'Вывести все запросы на присоединение к активной группе' })
    @ApiResponse({ type: GroupRequestSecureExtendDto, isArray: true})
    @Get()
    @UseGuards(OnlyHaveGroupGuard)
    async getRequestsByGroupId(@UserProfile('groupId') groupId?: number) {
        return this.groupsRequestsBaseService.getRequestsByGroupId(groupId, true)
            .then(requests => requests.map(request => {
                const { profile, group, ...cleanRequest } = request;
                return {
                    ...cleanRequest,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    photo: profile.photo
                };
            }));
    }

    @ApiOperation({ summary: 'Вывести все запросы на присоединение к группам активного пользователя' })
    @ApiResponse({ type: GroupRequestDto, isArray: true})
    @Get('me')
    getMyRequests(@UserProfile('id') profileId: number) {
        return this.groupsRequestsBaseService.getRequestsByProfileId(profileId);
    }

    @ApiOperation({ summary: 'Отклонить запрос на присоединение к активной группе активного пользователя' })
    @ApiParam({ description: 'ID Запроса на присоединение', name: 'id', type: String })
    @Patch('cancel/:id')
    @UseGuards(OnlyHaveGroupGuard)
    cancelRequestToJoin(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        return this.groupsRequestsService.actionWithRequest(id, groupId ,0);
    }

    @ApiOperation({ summary: 'Принять запрос на присоединение к активной группе активного пользователя' })
    @ApiParam({ description: 'ID Запроса на присоединение', name: 'id', type: String })
    @ApiResponse({ type: GroupDto, isArray: true})
    @Patch('accept/:id')
    @UseGuards(OnlyHaveGroupGuard)
    acceptRequestToJoin(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        return this.groupsRequestsService.actionWithRequest(id, groupId, 1);
    }

    @ApiOperation({ summary: 'Удалить запрос на присоединение к группе активного пользователя' })
    @ApiParam({ description: 'ID Запроса на присоединение', name: 'id', type: String })
    @Delete(':id')
    deleteRequestById(@UserProfile('id') profileId: number, @Param('id', ParseIntPipe) id: number) {
        return this.groupsRequestsBaseService.deleteRequestByIdAndProfileId(id, profileId);
    }
}
