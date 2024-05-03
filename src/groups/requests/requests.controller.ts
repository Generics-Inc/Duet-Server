import {Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {AccessTokenGuard, OnlyHaveGroupGuard} from "../../auth/guard";
import {GroupsRequestsService} from "./requests.service";
import {UserProfile} from "../../users/decorator";
import {GroupRequestDto, GroupRequestSecureExtendDto} from "./dto";
import {GroupDto} from "../dto";


@ApiTags('Запросы вступления в группы')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups/requests')
export class GroupsRequestsController {
    constructor(private groupsRequestsService: GroupsRequestsService) {}

    @ApiOperation({ summary: 'Вывести все запросы на присоединение к активной группе' })
    @ApiResponse({ type: GroupRequestSecureExtendDto, isArray: true})
    @Get()
    @UseGuards(OnlyHaveGroupGuard)
    async getRequestsByGroupId(@UserProfile('groupId') groupId?: number) {
        return this.groupsRequestsService.getRequestsByGroupId(groupId, true)
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
        return this.groupsRequestsService.getRequestsByProfileId(profileId);
    }

    @ApiOperation({ summary: 'Отклонить запрос на присоединение к активной группе активного пользователя' })
    @ApiParam({ description: 'ID Запроса на присоединение', name: 'id', type: String })
    @Patch('cancel/:id')
    @UseGuards(OnlyHaveGroupGuard)
    cancelRequestToJoin(@Param('id', ParseIntPipe) id: number) {
        return this.groupsRequestsService.actionWithRequest(id, 0);
    }

    @ApiOperation({ summary: 'Принять запрос на присоединение к активной группе активного пользователя' })
    @ApiParam({ description: 'ID Запроса на присоединение', name: 'id', type: String })
    @ApiResponse({ type: GroupDto, isArray: true})
    @Patch('accept/:id')
    @UseGuards(OnlyHaveGroupGuard)
    acceptRequestToJoin(@Param('id', ParseIntPipe) id: number) {
        return this.groupsRequestsService.actionWithRequest(id, 1);
    }

    @ApiOperation({ summary: 'Удалить запрос на присоединение к группе активного пользователя' })
    @ApiParam({ description: 'ID Запроса на присоединение', name: 'id', type: String })
    @Delete(':id')
    deleteRequestById(@UserProfile('id') profileId: number, @Param('id', ParseIntPipe) id: number) {
        return this.groupsRequestsService.deleteRequest(profileId, id);
    }
}
