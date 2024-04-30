import {
    Controller,
    Get,
    Param,
    Res,
    StreamableFile,
} from '@nestjs/common';
import {FilesService} from "./files.service";
import {DownloadDto} from "./dto";
import {UploadDto, UploadResponseDto} from "./dto/upload.dto";
import {PostFile, UploadedPostFile, UploadedPostFileReturn} from "../app/decorators";

@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) {}

    //@Throttle({ default: { ttl: 15000, limit: 1 }})
    @PostFile('upload/:bucketName/')
    async uploadSingle(@UploadedPostFile({
        fileSize: 2 * 1024 ** 2,
        fileType: '.(jpg|png|jpeg)',
        bodyType: UploadDto
    }) file: UploadedPostFileReturn<UploadDto>): Promise<UploadResponseDto> {
        return await this.filesService.upload(file.params.bucketName, file.body.fileDir, file.file.buffer);
    }

    @Get('download/:bucketName/*')
    async downloadStreamable(@Res({ passthrough: true }) _: Response, @Param() { bucketName, 0: fileName }: DownloadDto) {
        return new StreamableFile(await this.filesService.download(bucketName, fileName));
    }
}
