import {Controller, Get, UseGuards} from '@nestjs/common';
import {AccessTokenGuard, HaveRoleAccessGuard} from "../auth/guard";
import {SessionsService} from "./sessions.service";
import {Roles, UserData} from "../users/decorator";
import {Role, Session} from "@prisma/client";
import {SessionIncludes} from "../types";

@UseGuards(AccessTokenGuard)
@Controller('sessions')
export class SessionsController {
    constructor(private sessionsService: SessionsService) {}

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAll(): Promise<Session[]> {
        return this.sessionsService.getSessions();
    }
    @Get('full')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAllFull(): Promise<SessionIncludes[]> {
        return this.sessionsService.getSessions(undefined, true);
    }

    @Get('me/all')
    getMeAll(@UserData('id') userId: number) {
        return this.sessionsService.getSessions({ userId });
    }
}
