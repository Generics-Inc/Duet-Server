import {Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {GroupRequestDto, GroupRequestModelDto} from "@models/groups/requests/dto";
import {AccessTokenGuard, OnlyHaveGroupGuard} from "@modules/auth/guard";
import {GroupsRequestsService} from "@modules/groups/requests/requests.service";
import {UserProfile} from "@modules/users/decorator";


@ApiTags('Запросы вступления в группы')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups/requests')
export class GroupsRequestsController {
    constructor(private selfService: GroupsRequestsService) {}

    @ApiOperation({ summary: 'Вывести все запросы на присоединение к активной группе' })
    @ApiResponse({ type: GroupRequestDto, isArray: true})
    @Get()
    @UseGuards(OnlyHaveGroupGuard)
    getAllForActiveGroup(@UserProfile('groupId') groupId: number) {
        return this.selfService.getModel().getManyByGroupId(groupId);
    }

    @ApiOperation({ summary: 'Вывести все запросы на присоединение к группам активного пользователя' })
    @ApiResponse({ type: GroupRequestModelDto, isArray: true})
    @Get('me')
    getMyRequests(@UserProfile('id') profileId: number) {
        return this.selfService.getModel().getManyByProfileId(profileId);
    }

    @ApiOperation({ summary: 'Отклонить запрос на присоединение к активной группе активного пользователя' })
    @ApiParam({ description: 'ID Запроса на присоединение', name: 'id', type: String })
    @ApiResponse({ type: GroupRequestModelDto })
    @Patch('cancel/:id')
    @UseGuards(OnlyHaveGroupGuard)
    cancelRequestToJoin(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        return this.selfService.actionWithRequest(id, groupId ,0);
    }

    @ApiOperation({ summary: 'Принять запрос на присоединение к активной группе активного пользователя' })
    @ApiParam({ description: 'ID Запроса на присоединение', name: 'id', type: String })
    @ApiResponse({ type: GroupRequestModelDto })
    @Patch('accept/:id')
    @UseGuards(OnlyHaveGroupGuard)
    acceptRequestToJoin(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        return this.selfService.actionWithRequest(id, groupId, 1);
    }

    @ApiOperation({ summary: 'Удалить запрос на присоединение к группе активного пользователя' })
    @ApiParam({ description: 'ID Запроса на присоединение', name: 'id', type: String })
    @ApiResponse({ type: GroupRequestModelDto })
    @Delete(':id')
    deleteRequestById(@UserProfile('id') profileId: number, @Param('id', ParseIntPipe) id: number) {
        return this.selfService.getModel().deleteByIdAndProfileId(id, profileId);
    }
}
