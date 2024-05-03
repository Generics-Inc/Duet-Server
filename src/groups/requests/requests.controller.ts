import {Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards} from '@nestjs/common';
import {ApiSecurity, ApiTags} from "@nestjs/swagger";
import {AccessTokenGuard, OnlyHaveGroupGuard} from "../../auth/guard";
import {GroupsRequestsService} from "./requests.service";
import {UserProfile} from "../../users/decorator";


@ApiTags('Запросы вступления в группы')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('groups/requests')
export class GroupsRequestsController {
    constructor(private groupsRequestsService: GroupsRequestsService) {}

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

    @Get('me')
    getMyRequests(@UserProfile('id') profileId: number) {
        return this.groupsRequestsService.getRequestsByProfileId(profileId);
    }

    @Patch('cancel/:id')
    @UseGuards(OnlyHaveGroupGuard)
    cancelRequestToJoin(@Param('id', ParseIntPipe) id: number) {
        return this.groupsRequestsService.actionWithRequest(id, 0);
    }

    @Patch('accept/:id')
    @UseGuards(OnlyHaveGroupGuard)
    acceptRequestToJoin(@Param('id', ParseIntPipe) id: number) {
        return this.groupsRequestsService.actionWithRequest(id, 1);
    }

    @Delete(':id')
    deleteRequestById(@UserProfile('id') profileId: number, @Param('id', ParseIntPipe) id: number) {
        return this.groupsRequestsService.deleteRequest(profileId, id);
    }
}
