import {Controller, Delete, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {MovieNotFoundException} from "@root/errors";
import {OnlyCompleteGroupGuard} from "@modules/auth/guard";
import {MoviesService} from "@modules/movies/movies.service";
import {UserProfile} from "@modules/users/decorator";
import {CreateMovieDto} from "@modules/movies/dto";
import {PostFile, UploadedPostFile, UploadedPostFileReturn} from "@modules/app/decorators";
import {Profile} from "@prisma/client";
import { utils } from '@root/helpers';

@ApiTags('Раздел "Кино"')
@ApiSecurity('AccessToken')
@UseGuards(OnlyCompleteGroupGuard)
@Controller('movies')
export class MoviesController {
    private utils = utils();

    constructor(
        private selfService: MoviesService
    ) {}

    @Get()
    getAllFromActiveGroup(@UserProfile('groupId') groupId: number) {
        return this.selfService.getModel().getMoviesByGroupId(groupId)
    }

    @Get(':id')
    async getById(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        return this.utils.ifEmptyGivesError(await this.selfService.getModel().getMovieByIdAndGroupId(id, groupId), MovieNotFoundException);
    }

    @Get(':id/full')
    async getFullById(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        return this.utils.ifEmptyGivesError(await this.selfService.getModel().getMovieByIdAndGroupId(id, groupId, true), MovieNotFoundException);
    }

    @ApiOperation({ })
    @ApiBody({ type: CreateMovieDto })
    @PostFile()
    createMovie(@UploadedPostFile({
        fileSize: 5 * 1024 ** 2,
        fileType: '.(jpg|jpeg|png)',
        bodyType: CreateMovieDto
    }) form: UploadedPostFileReturn<CreateMovieDto>, @UserProfile() profile: Profile) {
        return this.selfService.createMovie(profile.id, profile.groupId, form);
    }

    @Delete(':id')
    async deleteMovie(@UserProfile('groupId') groupId: number, @Param('id', ParseIntPipe) id: number) {
        this.utils.ifEmptyGivesError(await this.selfService.getModel().getMovieByIdAndGroupId(id, groupId), MovieNotFoundException);
        return this.selfService.getModel().deleteMovieByIdAndGroupId(id, groupId);
    }
}

//https://yandex.com/images-xml?folderid=&apikey=&fyandex=0&text='обложка фильма Мстители'
