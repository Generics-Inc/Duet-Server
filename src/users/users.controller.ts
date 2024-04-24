import {Controller, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import useUtils from "../composables/useUtils";
import {HaveRoleAccessGuard} from "../auth/guard";
import {Roles} from "./decorator";
import {Role} from "@prisma/client";


@Roles(Role.ADMIN)
@UseGuards(HaveRoleAccessGuard)
@Controller('users')
export class UsersController {
    private utils = useUtils();

    constructor(private usersService: UsersService) {}


    // refactor
    // @Delete(':id')
    // @Roles(Role.ADMIN)
    // @UseGuards(OnlyHaveGroupGuard)
    // async deleteUserById(@Param('id') id: string): Promise<Profile> {
    //     this.utils.checkIdCurrent(id);
    //     return this.usersService.deleteUserById(+id);
    // }
}
