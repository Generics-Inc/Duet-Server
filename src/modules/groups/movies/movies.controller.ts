import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards} from "@nestjs/common";
import {GroupsMoviesService} from "./movies.service";
import {OnlyCompleteGroupGuard} from "@modules/auth/guard";
import {UserProfile} from "@modules/users/decorator";
import {ProfileDto} from "@models/users/profiles/dto";
import {CreateRatingDto} from "@modules/groups/movies/dto";
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {GroupMovieDto, GroupMovieMinimalDto, GroupMovieRatingDto} from "@models/groups/movies/dto";


@ApiTags('Раздел "Кинотека"')
@ApiSecurity('AccessToken')
@UseGuards(OnlyCompleteGroupGuard)
@Controller('groups/movies')
export class GroupsMoviesController {
    constructor(private selfService: GroupsMoviesService) {}

    @ApiOperation({ summary: 'Вывести список всех фильмов группы' })
    @ApiResponse({ status: 200, type: GroupMovieMinimalDto, isArray: true })
    @Get()
    getAll(@UserProfile('groupId') groupId: number) {
        return this.selfService.getModel().getManyMinimalMoviesByGroupId(groupId)
    }

    @ApiOperation({ summary: 'Вывести фильм по ID со всей информацией' })
    @ApiParam({ description: 'ID фильма в группе', name: 'id', type: Number })
    @ApiResponse({ status: 200, type: GroupMovieDto })
    @Get(':id')
    getById(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        return this.selfService.getMovieByIdAndGroupId(id, groupId);
    }

    @ApiOperation({ summary: 'Запустить задачу создания фильма заново (только в случае ошибки)' })
    @ApiParam({ description: 'ID задачи на создание фильма', name: 'id', type: Number })
    @ApiResponse({ status: 200 })
    @Patch('tasks/:id')
    restartTaskById(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        return this.selfService.restartTaskByIdAndGroupId(id, groupId);
    }

    @ApiOperation({ summary: 'Изменить статус серии на просмотрено/не просмотрено' })
    @ApiParam({ description: 'ID фильма в группе', name: 'movieId', type: Number })
    @ApiParam({ description: 'ID серии фильма', name: 'seriaId', type: Number })
    @ApiResponse({ status: 200, type: GroupMovieDto })
    @Patch(':movieId/series/:seriaId')
    setWatchedSeriaById(
        @UserProfile('groupId') groupId: number,
        @Param('movieId', ParseIntPipe) movieId: number,
        @Param('seriaId', ParseIntPipe) seriaId: number
    ) {
        return this.selfService.setWatchedSeria(seriaId, movieId, groupId);
    }

    @ApiOperation({ summary: 'Изменить флаг просмотра фильма на просмотрено/не просмотрено' })
    @ApiParam({ description: 'ID фильма в группе', name: 'movieId', type: Number })
    @ApiResponse({ status: 200, type: GroupMovieDto })
    @Patch(':movieId/setWatched')
    setWatchedMovieById(
        @UserProfile('groupId') groupId: number,
        @Param('movieId', ParseIntPipe) movieId: number
    ) {
        return this.selfService.setWatchedMovie(movieId, groupId);
    }

    @ApiOperation({ summary: 'Задать или изменить оценку фильму' })
    @ApiParam({ description: 'ID фильма в группе', name: 'movieId', type: Number })
    @ApiResponse({ status: 200, type: GroupMovieRatingDto })
    @Patch(':movieId/setRating')
    setRatingMovieById(
        @UserProfile() profile: ProfileDto,
        @Param('movieId', ParseIntPipe) movieId: number,
        @Body() body: CreateRatingDto
    ) {
        return this.selfService.upsertRatingByGroupMovieIdAndGroupIdAndProfileId(movieId, profile.groupId, profile.id, body.scope);
    }

    @ApiOperation({ summary: 'Удалить фильм из группы' })
    @ApiParam({ description: 'ID фильма в группе', name: 'movieId', type: Number })
    @ApiResponse({ status: 200, type: GroupMovieMinimalDto })
    @Delete(':movieId')
    deleteById(
        @UserProfile('groupId') groupId: number,
        @Param('movieId', ParseIntPipe) movieId: number
    ) {
        return this.selfService.deleteMovieByIdAndGroupId(movieId, groupId);
    }
}
