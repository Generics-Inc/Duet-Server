import {Controller, UseGuards} from '@nestjs/common';
import {Role} from "@prisma/client";
import {HaveRoleAccessGuard} from "@modules/auth/guard";
import {Roles} from "./decorator";


@Roles(Role.ADMIN)
@UseGuards(HaveRoleAccessGuard)
@Controller('users')
export class UsersController {
}
