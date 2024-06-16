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

    @Patch(':movieId/series/:seriaId')
    setWatchedSeriaById(
        @UserProfile('groupId') groupId: number,
        @Param('movieId', ParseIntPipe) movieId: number,
        @Param('seriaId', ParseIntPipe) seriaId: number
    ) {
        return this.selfService.setWatchedSeria(seriaId, movieId, groupId);
    }

    @Patch(':movieId')
    setWatchedMovieById(@UserProfile('groupId') groupId: number, @Param('movieId', ParseIntPipe) movieId: number) {
        return this.selfService.setWatchedMovie(movieId, groupId);
    }

    @Delete(':movieId')
    deleteById(@UserProfile('groupId') groupId: number, @Param('movieId', ParseIntPipe) movieId: number) {
        return this.selfService.deleteMovieByIdAndGroupId(movieId, groupId);
    }
}
