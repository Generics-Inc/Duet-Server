import {Controller, Delete, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {MovieNotFoundException} from "@root/errors";
import {OnlyCompleteGroupGuard} from "@modules/auth/guard";
import {MoviesService} from "@modules/movies/movies.service";
import {UserProfile} from "@modules/users/decorator";
import {CreateMovieDto} from "@modules/movies/dto";
import {PostFile, UploadedPostFile, UploadedPostFileReturn} from "@modules/app/decorators";
import { utils } from '@root/helpers';
import {ProfileDto} from "@models/users/profiles/dto";

@ApiTags('Раздел "Кинотека"')
@ApiSecurity('AccessToken')
@UseGuards(OnlyCompleteGroupGuard)
@Controller('movies')
export class MoviesController {
    private utils = utils();

    constructor(
        private selfService: MoviesService
    ) {}

    @ApiOperation({ summary: 'Вывести всю кинотеку группы' })
    @Get()
    getAllByGroupId(@UserProfile('groupId') groupId: number) {
        return this.selfService.getModel().getMoviesByGroupId(groupId)
    }

    @ApiOperation({ summary: 'Вывести запись из кинотеки по ID' })
    @Get(':id')
    async getById(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        return this.utils.ifEmptyGivesError(await this.selfService.getModel().getMovieByIdAndGroupId(id, groupId, true), MovieNotFoundException);
    }

    @ApiOperation({ summary: 'Создать группу (возможно использование ИИ)' })
    @ApiBody({ type: CreateMovieDto })
    @PostFile()
    createMovie(@UploadedPostFile({
        fileSize: 5 * 1024 ** 2,
        fileType: '.(jpg|jpeg|png)',
        bodyType: CreateMovieDto
    }) form: UploadedPostFileReturn<CreateMovieDto>, @UserProfile() profile: ProfileDto) {
        //return this.selfService.createMovie(profile.id, profile.groupId, form);
    }


    @ApiOperation({ summary: 'Удалить запись из кинотеки' })
    @Delete(':id')
    async deleteMovie(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        this.utils.ifEmptyGivesError(await this.selfService.getModel().getMovieByIdAndGroupId(id, groupId), MovieNotFoundException);
        return this.selfService.getModel().deleteMovieByIdAndGroupId(id, groupId);
    }
}
