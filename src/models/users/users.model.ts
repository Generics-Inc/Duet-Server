import {Module} from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {UsersProfilesModelService} from "./profiles/profiles.service";
import {UsersModelService} from "./users.service";


@Module({
    providers: [
        UsersModelService,
        UsersProfilesModelService,
        PrismaService
    ],
    exports: [
        UsersModelService,
        UsersProfilesModelService
    ]
})
export class UsersModel{
}
