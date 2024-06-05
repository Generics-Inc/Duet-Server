import * as AWS from "@aws-sdk/client-s3";
import * as Sharp from 'sharp';
import { createHash } from "crypto";
import {Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {AccessToEntity, utils} from "@root/helpers";
import {BasketNotFoundException, DirectoryAccessDividedException, FileDeletingException, FileNotFoundException } from "@root/errors";
import {UsersProfilesModelService} from "@models/users/profiles/profiles.service";
import {GroupsModelService} from "@models/groups/groups.service";
import {FilesAccessConfig, FilesBucketName, FilesUploadConfig} from "./entities";
import {MoviesModelService} from "@models/movies/movies.service";


@Injectable()
export class FilesService {
    private profileKeysToRights: FilesAccessConfig;
    private utils = utils();
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
        private usersProfileModelService: UsersProfilesModelService,
        private groupsModelService: GroupsModelService,
        private moviesModelService: MoviesModelService,
        private configService: ConfigService
    ) {
        this.profileKeysToRights = {
            'group': AccessToEntity.accessToGroup.bind(this, this.usersProfileModelService),
            'profile': AccessToEntity.accessToProfileWithRequests.bind(this, this.usersProfileModelService, this.groupsModelService),
            'movie': AccessToEntity.accessToMovie.bind(this, this.usersProfileModelService, this.moviesModelService)
        };
    }

    async upload(config: FilesUploadConfig): Promise<string> {
        const _config: Required<FilesUploadConfig> = {
            fileName: createHash("sha256").update(config.file).digest("hex"),
            sharpBuilder: (file) => file,
            ...config
        };

        if (!await this.isHaveAccessToDirectory(_config.profileId, _config.bucketName, _config.fileDir))
            throw DirectoryAccessDividedException;
        await this.nextOrCreateBucket(_config.bucketName);

        const buildFileName = `${this.utils.trimStr(config.fileDir, '/')}/${_config.fileName}.png`;

        await this.s3Client.send(new AWS.PutObjectCommand({
            Bucket: _config.bucketName,
            Key: buildFileName,
            Body: await _config.sharpBuilder(Sharp(_config.file)).png().toBuffer()
        }));

        return `files/download/${_config.bucketName}/${buildFileName}`;
    }

    async download(profileId: number, bucketName: FilesBucketName, fileName: string) {
        if (!await this.isHaveAccessToDirectory(profileId, bucketName, fileName)) throw DirectoryAccessDividedException;
        if (!await this.isFileExist(bucketName, fileName)) throw FileNotFoundException;

        return await this.s3Client.send(new AWS.GetObjectCommand({
            Bucket: bucketName,
            Key: fileName
        })).then(file => file.Body.transformToByteArray());
    }

    async deleteFile(profileId: number, bucketName: FilesBucketName, fileName: string) {
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

    async deleteFolder(profileId: number, bucketName: FilesBucketName, folderPath: string) {
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

    async deleteFileOrThrow(profileId: number, bucketName: FilesBucketName, fileName: string) {
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
    async deleteFolderOrThrow(profileId: number, bucketName: FilesBucketName, fileName: string) {
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

    private async isHaveAccessToDirectory(profileId: number, bucketName: FilesBucketName, path: string): Promise<boolean> {
        if (!Object.keys(this.profileKeysToRights).includes(bucketName)) throw BasketNotFoundException;
        if (profileId === -1) return true;

        const directoryId = Number.parseInt(path.split('/')[0] ?? '-1');

        let r = await this.profileKeysToRights[bucketName].bind(this, profileId, directoryId)();
        return r.status;
    }
    private async isFolderExist(bucketName: FilesBucketName, folderPath: string): Promise<boolean> {
        try {
            return !!await this.s3Client.listObjectsV2({
                Bucket: bucketName,
                Prefix: folderPath
            }).then(res => res.Contents);
        } catch (_) {
            return false;
        }
    }
    private async isFileExist(bucketName: FilesBucketName, fileName: string): Promise<boolean> {
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
    private async isBucketExist(bucketName: FilesBucketName): Promise<boolean> {
        try {
            await this.s3Client.headBucket({ Bucket: bucketName });
            return true;
        } catch (_) {
            return false;
        }
    }

    private async nextOrCreateBucket(bucketName: FilesBucketName): Promise<void> {
        if (await this.isBucketExist(bucketName)) return;

        await this.s3Client.createBucket({ Bucket: bucketName });
    }
}
