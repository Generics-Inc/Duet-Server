import {
    Body,
    Controller,
    FileTypeValidator, Get, Headers,
    MaxFileSizeValidator, Param,
    ParseFilePipe,
    Post, Res, StreamableFile,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {FilesService} from "./files.service";
import {Throttle} from "@nestjs/throttler";
import {DownloadDto} from "./dto";
import {UploadDto, UploadResponseDto} from "./dto/upload.dto";
import {BucketDto} from "./dto/bucket.dto";

const maxFileSize = 2.5 * 1024 ** 2;

@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) {}

    //@Throttle({ default: { ttl: 15000, limit: 1 }})
    @Post('upload/:bucketName/')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSingle(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: maxFileSize, message: `Максимальный размер файла ${maxFileSize} байт` }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
                ]
            })
        ) file: Express.Multer.File,
        @Param('bucketName') bucketName: BucketDto,
        @Body() body: UploadDto,
        @Headers() headers: { host: string }
    ): Promise<UploadResponseDto> {
        return await this.filesService.upload(bucketName, body.fileDir, file.buffer, headers.host);
    }

    @Get('download/:bucketName/*')
    async downloadStreamable(@Res({ passthrough: true }) _: Response, @Param() { bucketName, 0: fileName }: DownloadDto) {
        return new StreamableFile(await this.filesService.download(bucketName, fileName));
    }
}
