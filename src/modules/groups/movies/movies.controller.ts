import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards} from "@nestjs/common";
import {GroupsMoviesService} from "./movies.service";
import {OnlyHaveGroupGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/users/decorator";
import {ProfileDto} from "@models/users/profiles/dto";
import {CreateRatingDto} from "@modules/groups/movies/dto";

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

    @Patch(':movieId/setWatched')
    setWatchedMovieById(
        @UserProfile('groupId') groupId: number,
        @Param('movieId', ParseIntPipe) movieId: number
    ) {
        return this.selfService.setWatchedMovie(movieId, groupId);
    }

    @Patch(':movieId/setRating')
    setRatingMovieById(
        @UserProfile() profile: ProfileDto,
        @Param('movieId', ParseIntPipe) movieId: number,
        @Body() body: CreateRatingDto
    ) {
        return this.selfService.upsertRatingByGroupMovieIdAndGroupIdAndProfileId(movieId, profile.groupId, profile.id, body.scope);
    }

    @Delete(':movieId')
    deleteById(
        @UserProfile('groupId') groupId: number,
        @Param('movieId', ParseIntPipe) movieId: number
    ) {
        return this.selfService.deleteMovieByIdAndGroupId(movieId, groupId);
    }
}
