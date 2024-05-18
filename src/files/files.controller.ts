import {
    Controller,
    Get, HttpStatus,
    Param,
    Res,
    StreamableFile, UseGuards,
} from '@nestjs/common';
import {FilesService} from "./files.service";
import {DownloadDto} from "./dto";
import {ApiOperation, ApiParam, ApiProduces, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {AccessTokenGuard} from "../auth/guard";
import {UserProfile} from "../users/decorator";

@ApiTags('Файлы')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) {}

    // @Throttle({ default: { ttl: 15000, limit: 1 }})
    // @PostFile('upload/:bucketName/')
    // async uploadSingle(@UploadedPostFile({
    //     fileSize: 2 * 1024 ** 2,
    //     fileType: '.(jpg|png|jpeg)',
    //     bodyType: UploadDto
    // }) file: UploadedPostFileReturn<UploadDto>): Promise<UploadResponseDto> {
    //     return await this.filesService.upload(file.params.bucketName, file.body.fileDir, file.file.buffer);
    // }

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
