import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {PrismaService} from "../prisma.service";
import {ProfilesController} from "./profiles/profiles.controller";
import {ProfilesService} from "./profiles/profiles.service";

@Module({
    controllers: [
        UsersController,
        ProfilesController
    ],
    providers: [
        UsersService,
        ProfilesService,
        PrismaService
    ],
    exports: [
        UsersService,
        ProfilesService
    ]
})
export class UsersModule {
}
