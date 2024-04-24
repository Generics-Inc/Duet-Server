import {Module} from '@nestjs/common';
import {GroupsController} from './groups.controller';
import {GroupsService} from './groups.service';
import {PrismaService} from "../prisma.service";
import {UsersModule} from "../users/users.module";
import {GroupsArchiveService} from "./archive/archive.service";
import {GroupsArchiveController} from "./archive/archive.controller";

@Module({
    imports: [
        UsersModule
    ],
    controllers: [
        GroupsController,
        GroupsArchiveController
    ],
    providers: [
        GroupsService,
        GroupsArchiveService,
        PrismaService
    ]
})
export class GroupsModule {}
