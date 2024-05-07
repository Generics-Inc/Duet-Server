import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {FileDeletingException, FileNotFoundException, FolderNotFoundException} from "../errors";
import * as AWS from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import useUtils from "../composables/useUtils";
import {UploadResponseDto} from "./dto/upload.dto";
import {UploadedPostFileReturn} from "../app/decorators";

@Injectable()
export class FilesService {
    private utils = useUtils();
    private s3Client = new AWS.S3({
        region: 'ru',
        credentials: {
            accessKeyId: this.configService.getOrThrow('MINIO_ACCESS_KEY'),
            secretAccessKey: this.configService.getOrThrow('MINIO_SECRET_KEY'),
        },
        endpoint: this.configService.get('MINIO_ORIGIN', 'http://127.0.0.1:9000'),
    });

    constructor(private configService: ConfigService) {}

    async upload(bucketName: string, fileDir: string, form: UploadedPostFileReturn): Promise<UploadResponseDto> {
        await this.nextOrCreateBucket(bucketName);

        const file = form.file.buffer;
        const imageName = this.utils.trimStr(fileDir, '/') + '/' + createHash("sha256")
            .update(file)
            .digest("hex") + '.png';

        await this.s3Client.send(new AWS.PutObjectCommand({
            Bucket: bucketName,
            Key: imageName,
            Body: file
        }));

        return {
            link: `${form.host}/api/files/download/${bucketName}/${imageName}`
        };
    }
    async download(bucketName: string, fileName: string) {
        if (!await this.isFileExist(bucketName, fileName)) throw FileNotFoundException;

        return await this.s3Client.send(new AWS.GetObjectCommand({
            Bucket: bucketName,
            Key: fileName
        })).then(file => file.Body.transformToByteArray());
    }
    async deleteFile(bucketName: string, fileName: string) {
        if (!await this.isFileExist(bucketName, fileName)) throw FileNotFoundException;

        try {
            await this.s3Client.deleteObject({
                Bucket: bucketName,
                Key: fileName
            });
        } catch(error) {
            throw FileDeletingException;
        }
    }
    async deleteFolder(bucketName: string, folderPath: string) {
        if (!await this.isFolderExist(bucketName, folderPath)) throw FolderNotFoundException;

        const filesKeys = await this.s3Client.listObjectsV2({
            Bucket: bucketName,
            Prefix: folderPath
        }).then(res => res.Contents.map(file => ({ Key: file.Key })));

        try {
            await this.s3Client.deleteObjects({
                Bucket: bucketName,
                Delete: { Objects: filesKeys }
            });
        } catch(error) {
            throw FileDeletingException;
        }
    }

    private async isFolderExist(bucketName: string, folderPath: string): Promise<boolean> {
        try {
            return !!await this.s3Client.listObjectsV2({
                Bucket: bucketName,
                Prefix: folderPath
            }).then(res => res.Contents);
        } catch (_) {
            return false;
        }
    }
    private async isFileExist(bucketName: string, fileName: string): Promise<boolean> {
        try {
            await this.s3Client.headObject({
                Bucket: bucketName,
                Key: fileName
            });
            return true;
        } catch (_) {
            return false;
        }
    }
    private async isBucketExist(bucketName: string): Promise<boolean> {
        try {
            await this.s3Client.headBucket({ Bucket: bucketName });
            return true;
        } catch (_) {
            return false;
        }
    }
    private async nextOrCreateBucket(bucketName: string): Promise<void> {
        if (await this.isBucketExist(bucketName)) return;

        await this.s3Client.createBucket({ Bucket: bucketName });
    }
}
