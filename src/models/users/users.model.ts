import {Module} from '@nestjs/common';
import {UsersProfilesModelService} from "./profiles/profiles.service";
import {UsersModelService} from "./users.service";


@Module({
    providers: [
        UsersModelService,
        UsersProfilesModelService
    ],
    exports: [
        UsersModelService,
        UsersProfilesModelService
    ]
})
export class UsersModel{
}
