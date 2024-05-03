import {Controller, UseGuards} from '@nestjs/common';
import {HaveRoleAccessGuard} from "../auth/guard";
import {Roles} from "./decorator";
import {Role} from "@prisma/client";


@Roles(Role.ADMIN)
@UseGuards(HaveRoleAccessGuard)
@Controller('users')
export class UsersController {
}
