import * as Sharp from "sharp";
import {AccessToEntity} from "@root/helpers";
import {PrismaService} from "@modules/prisma/prisma.service";

export type FilesBucketName = 'profile' | 'group' | 'movie';

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
