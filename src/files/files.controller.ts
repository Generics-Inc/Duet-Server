import {
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {FilesService} from "./files.service";
import {SkipThrottle, Throttle} from "@nestjs/throttler";

const maxFileSize = 2.5 * 1024 ** 2;

@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) {}

    @Throttle({ default: { ttl: 15000, limit: 1 }})
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSingle(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: maxFileSize, message: `Максимальный размер файла ${maxFileSize} байт` }),
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
            ]
        })
    ) file: Express.Multer.File) {
        await this.filesService.upload(file.originalname, file.buffer);
    }
}
