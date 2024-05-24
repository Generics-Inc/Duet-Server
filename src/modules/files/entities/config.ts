import * as Sharp from "sharp";
import {PrismaService} from "@root/singles";
import {AccessToEntity} from "@root/helpers";

export type FilesBucketName = 'profile' | 'group';

export type FilesUploadConfig = {
    profileId: number;
    bucketName: FilesBucketName;
    fileDir: string;
    file: Buffer;
    fileName?: string;
    sharpBuilder?: (file: Sharp.Sharp) => Sharp.Sharp;
};
export type FilesAccessConfig = {
    [name in FilesBucketName]: (prismaService: PrismaService, profileId: number, directoryId: number) => AccessToEntity.AccessCheckReturn;
};
