import {Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards} from "@nestjs/common";
import {GroupsMoviesService} from "./movies.service";
import {OnlyHaveGroupGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/users/decorator";

@UseGuards(OnlyHaveGroupGuard)
@Controller('groups/movies')
export class GroupsMoviesController {
    constructor(private selfService: GroupsMoviesService) {}

    @Get()
    getAll(@UserProfile('groupId') groupId: number) {
        return this.selfService.getModel().getManyMinimalMoviesByGroupId(groupId)
    }

    @Get(':id')
    getById(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        return this.selfService.getMovieByIdAndGroupId(id, groupId);
    }

    @Patch('tasks/:id')
    restartTaskById(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        return this.selfService.restartTaskByIdAndGroupId(id, groupId);
    }

    @Delete(':id')
    deleteById(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        return this.selfService.deleteMovieByIdAndGroupId(id, groupId);
    }
}
