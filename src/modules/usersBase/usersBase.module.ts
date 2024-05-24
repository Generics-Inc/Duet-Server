import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {ProfilesBaseController} from "./profilesBase/profilesBase.controller";
import {ProfilesBaseService} from "./profilesBase/profilesBase.service";
import {UsersBaseService} from "./usersBase.service";


@Module({
    controllers: [
        ProfilesBaseController
    ],
    providers: [
        UsersBaseService,
        ProfilesBaseService,
        PrismaService
    ],
    exports: [
        UsersBaseService,
        ProfilesBaseService
    ]
})
export class UsersBaseModule {
}
