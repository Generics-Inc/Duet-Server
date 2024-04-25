import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {S3} from "aws-sdk";

@Injectable()
export class FilesService {
    private s3Stream = new S3({
        accessKeyId: this.configService.getOrThrow('MINIO_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow('MINIO_SECRET_KEY'),
        endpoint: this.configService.get('MINIO_ORIGIN', 'http://127.0.0.1:9000'),
        s3ForcePathStyle: true,
        signatureVersion: 'v4'
    });

    constructor(private configService: ConfigService) {}

    async upload(fileName: string, file: Buffer) {
        const bucketName = 'uploaded';

        await this.nextOrCreateBucket(bucketName);

        await this.s3Stream.upload({
            Bucket: bucketName,
            Key: fileName,
            Body: file
        }).promise();
    }

    async nextOrCreateBucket(bucketName: string): Promise<void> {
        try {
            await this.s3Stream.headBucket({ Bucket: bucketName }).promise();
        } catch (_) {
            await this.s3Stream.createBucket({ Bucket: bucketName }).promise();
        }
    }
}
