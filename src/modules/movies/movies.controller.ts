import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {OnlyHaveGroupGuard} from "@modules/auth/guard";
import {MoviesService} from "@modules/movies/movies.service";
import {UserProfile} from "@modules/users/decorator";
import {CreateMovieAsyncDto, CreateMovieDto} from "@modules/movies/dto";
import {PostFile, UploadedPostFile, UploadedPostFileReturn} from "@modules/app/decorators";
import {ProfileDto} from "@models/users/profiles/dto";


@ApiTags('Раздел "Кинотека"')
@ApiSecurity('AccessToken')
//@UseGuards(OnlyCompleteGroupGuard)
@UseGuards(OnlyHaveGroupGuard)
@Controller('movies')
export class MoviesController {
    constructor(
        private selfService: MoviesService
    ) {}

    @ApiOperation({ summary: 'Создать запись (возможно использование ИИ)' })
    @ApiBody({ type: CreateMovieDto })
    @PostFile('new')
    createMovie(@UploadedPostFile({
        fileSize: 5 * 1024 ** 2,
        fileType: '.(jpg|jpeg|png)',
        bodyType: CreateMovieDto
    }) form: UploadedPostFileReturn<CreateMovieDto>, @UserProfile() profile: ProfileDto) {
        return this.selfService.createMovie(profile.id, profile.groupId, form);
    }

    @ApiBody({ type: CreateMovieAsyncDto })
    @Post('newByLink')
    createMovieByLink(@UserProfile() profile: ProfileDto, @Body() data: CreateMovieAsyncDto) {
        return this.selfService.createMovieAsync(profile.id, profile.groupId, data);
    }
}
