import {ApiOperation, ApiParam, ApiProduces, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Get, Res, Param, UseGuards, Controller, HttpStatus, StreamableFile} from '@nestjs/common';
import {UserProfile} from "@modules/usersBase/decorator";
import {AccessTokenGuard} from "@modules/auth/guard";
import {FilesService} from "./files.service";
import {DownloadDto} from "./dto";

@ApiTags('Файлы')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) {}

    @ApiOperation({ summary: 'Скачать файл из хранилища' })
    @ApiParam({ description: 'Имя контейнера', name: 'bucketName', type: String })
    @ApiParam({ description: 'Полный путь до файла', name: '*', type: String })
    @ApiProduces('image/png')
    @ApiResponse({
        schema: { type: 'string', format: 'binary' },
        status: HttpStatus.OK,
    })
    @Get('download/:bucketName/*')
    async downloadStreamable(
        @Res({ passthrough: true }) _: Response,
        @UserProfile('id') profileId: number,
        @Param() { bucketName, 0: fileName }: DownloadDto
    ) {
        return new StreamableFile(await this.filesService.download(profileId, bucketName as any, fileName));
    }
}
