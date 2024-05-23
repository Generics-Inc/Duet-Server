import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {
    BasketNotFoundException,
    DirectoryAccessDividedException,
    FileDeletingException,
    FileNotFoundException
} from "../errors";
import * as AWS from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import useUtils from "../composables/useUtils";
import {UploadResponseDto} from "./dto/upload.dto";
import {ProfilesService} from "../users/profiles/profiles.service";

@Injectable()
export class FilesService {
    private profileKeysToRights = {
        'group': this.accessToGroup
    };
    private utils = useUtils();
    private s3Client = new AWS.S3({
        region: 'ru',
        credentials: {
            accessKeyId: this.configService.getOrThrow('MINIO_ACCESS_KEY'),
            secretAccessKey: this.configService.getOrThrow('MINIO_SECRET_KEY'),
        },
        endpoint: this.configService.get('MINIO_SERVER_URL', 'http://127.0.0.1:9000'),
        forcePathStyle: true
    });

    constructor(
        private configService: ConfigService,
        @Inject(forwardRef(() => ProfilesService))
        private profilesService: ProfilesService
    ) {}

    async upload(profileId: number, bucketName: string, fileDir: string, file: Buffer): Promise<UploadResponseDto> {
        if (!await this.isHaveAccessToDirectory(profileId, bucketName, fileDir)) throw DirectoryAccessDividedException;
        await this.nextOrCreateBucket(bucketName);

        const imageName = this.utils.trimStr(fileDir, '/') + '/' + createHash("sha256")
            .update(file)
            .digest("hex") + '.png';

        await this.s3Client.send(new AWS.PutObjectCommand({
            Bucket: bucketName,
            Key: imageName,
            Body: file
        }));

        return {
            link: `/files/download/${bucketName}/${imageName}`
        };
    }
    async download(profileId: number, bucketName: string, fileName: string) {
        if (!await this.isHaveAccessToDirectory(profileId, bucketName, fileName)) throw DirectoryAccessDividedException;
        if (!await this.isFileExist(bucketName, fileName)) throw FileNotFoundException;

        return await this.s3Client.send(new AWS.GetObjectCommand({
            Bucket: bucketName,
            Key: fileName
        })).then(file => file.Body.transformToByteArray());
    }
    async deleteFile(profileId: number, bucketName: string, fileName: string) {
        if (!await this.isHaveAccessToDirectory(profileId, bucketName, fileName)) return 3;
        if (!await this.isFileExist(bucketName, fileName)) return 2;

        try {
            await this.s3Client.deleteObject({
                Bucket: bucketName,
                Key: fileName
            });
            return 0;
        } catch(error) {
            return 1;
        }
    }
    async deleteFolder(profileId: number, bucketName: string, folderPath: string) {
        if (!await this.isHaveAccessToDirectory(profileId, bucketName, folderPath)) return 3;
        if (!await this.isFolderExist(bucketName, folderPath)) return 2;

        const filesKeys = await this.s3Client.listObjectsV2({
            Bucket: bucketName,
            Prefix: folderPath
        }).then(res => res.Contents.map(file => ({ Key: file.Key })));

        try {
            await this.s3Client.deleteObjects({
                Bucket: bucketName,
                Delete: { Objects: filesKeys }
            });
            return 0;
        } catch(error) {
            return 1;
        }
    }

    async deleteFileOrThrow(profileId: number, bucketName: string, fileName: string) {
        switch (await this.deleteFile(profileId, bucketName, fileName)) {
            case 0:
                return true;
            case 1:
                throw FileDeletingException;
            case 2:
                throw FileNotFoundException;
            case 3:
                throw DirectoryAccessDividedException;
        }
    }
    async deleteFolderOrThrow(profileId: number, bucketName: string, fileName: string) {
        switch (await this.deleteFolder(profileId, bucketName, fileName)) {
            case 0:
                return true;
            case 1:
                throw FileDeletingException;
            case 2:
                throw FileNotFoundException;
            case 3:
                throw DirectoryAccessDividedException;
        }
    }

    private async isHaveAccessToDirectory(profileId: number, bucketName: string, path: string): Promise<boolean> {
        if (!Object.keys(this.profileKeysToRights).includes(bucketName)) throw BasketNotFoundException;

        const directoryId = Number.parseInt(path.split('/')[0] ?? '-1');

        return this.profileKeysToRights[bucketName].bind(this, profileId, directoryId)();
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

    private async accessToGroup(profileId: number, directoryId?: number): Promise<boolean> {
        if (!directoryId) return false;

        const profile = await this.profilesService.getProfileById(profileId, true);
        const isGroupInArchive = !!profile.groupsArchives.find(rec => rec.groupId === directoryId);
        const isGroupActive = profile.groupId === directoryId;

        return isGroupActive || isGroupInArchive;
    }
}
