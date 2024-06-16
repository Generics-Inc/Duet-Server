import { Injectable } from '@nestjs/common';
import {UsersModelService} from "@models/users/users.service";
import { Prisma } from '@prisma/client';
import {AccountCreateException} from "@root/errors";
import {UsersProfilesModelService} from "@models/users/profiles/profiles.service";
import {PrismaService} from "@modules/prisma/prisma.service";
import {FilesService} from "@modules/files/files.service";
import {HttpService} from "@nestjs/axios";
import {CreateAccountTypeDto, CreateUserDto} from "./dto";
import getImageBufferByLink from "@root/helpers/getImageBufferByLink";


@Injectable()
export class UsersService {
    private repo: Prisma.UserDelegate;

    constructor(
        private modelService: UsersModelService,
        private usersProfileModelService: UsersProfilesModelService,
        private filesService: FilesService,
        private httpService: HttpService,
        prismaService: PrismaService
    ) {
        this.repo = prismaService.user;
    }

    getModel() {
        return this.modelService;
    }

    async createModel({ username, ...data }: CreateUserDto, accType: CreateAccountTypeDto) {
        const user = await this.repo.create({
            data: {
                username: username,
                profile: {
                    create: {
                        ...data
                    }
                },
                connectedAccount: {
                    create: accType
                }
            }
        });

        if (data.photo) {
            try {
                const uploadedPhoto = await getImageBufferByLink(data.photo);

                data.photo = uploadedPhoto ? (await this.filesService.upload({
                    profileId: user.id,
                    bucketName: 'profile',
                    fileName: 'main',
                    fileDir: user.id.toFixed(),
                    file: uploadedPhoto
                })) : undefined;
            } catch (e) {
                await this.modelService.deleteModelById(user.id);
                throw AccountCreateException;
            }
        } else {
            data.photo = undefined;
        }

        await this.usersProfileModelService.update(user.id, { photo: data.photo });
        return this.modelService.getModelById(user.id);
    }
}
