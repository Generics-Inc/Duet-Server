import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {OnlyCompleteGroupGuard} from "@modules/auth/guard";
import {MoviesService} from "@modules/movies/movies.service";
import {UserProfile} from "@modules/users/decorator";
import {CreateMovieAsyncDto, CreateMovieDto} from "@modules/movies/dto";
import {PostFile, UploadedPostFile, UploadedPostFileReturn} from "@modules/app/decorators";
import {ProfileDto} from "@models/users/profiles/dto";
import {GroupMovieDto} from "@models/groups/movies/dto";
import {HdrSearchReq} from "@modules/hdRezka/dto";
import {SearchMovieDto} from "@modules/movies/dto/searchMovie.dto";


@ApiTags('Раздел "Кинотека"')
@ApiSecurity('AccessToken')
@UseGuards(OnlyCompleteGroupGuard)
@Controller('movies')
export class MoviesController {
    constructor(private selfService: MoviesService) {}

    @ApiOperation({ summary: 'Создать фильм (возможно использование ИИ)' })
    @ApiBody({ type: CreateMovieDto })
    @ApiResponse({ status: 201, type: GroupMovieDto })
    @PostFile('new')
    createMovie(@UploadedPostFile({
        fileSize: 5 * 1024 ** 2,
        fileType: '.(jpg|jpeg|png)',
        bodyType: CreateMovieDto
    }) form: UploadedPostFileReturn<CreateMovieDto>, @UserProfile() profile: ProfileDto) {
        return this.selfService.createMovie(profile.id, profile.groupId, form);
    }

    @ApiOperation({ summary: 'Создание фильма из базы данных HDRezka' })
    @ApiBody({ type: CreateMovieAsyncDto })
    @ApiResponse({ status: 201, type: GroupMovieDto })
    @Post('newByLink')
    createMovieByLink(@UserProfile() profile: ProfileDto, @Body() data: CreateMovieAsyncDto) {
        return this.selfService.createMovieAsync(profile.id, profile.groupId, data);
    }

    @ApiOperation({ summary: 'Поиск фильмов по базе данных HDRezka' })
    @ApiBody({ type: SearchMovieDto })
    @ApiResponse({ status: 200, type: HdrSearchReq })
    @HttpCode(HttpStatus.OK)
    @Post('search')
    searchMovieByQuery(@Body() data: SearchMovieDto) {
        return this.selfService.searchMoviesByQuery(data.text);
    }
}
