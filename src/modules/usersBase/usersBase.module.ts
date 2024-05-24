import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {UsersProfilesBaseService} from "./profilesBase/profilesBase.service";
import {UsersBaseService} from "./usersBase.service";


@Module({
    providers: [
        UsersBaseService,
        UsersProfilesBaseService,
        PrismaService
    ],
    exports: [
        UsersBaseService,
        UsersProfilesBaseService
    ]
})
export class UsersBaseModule {
}
