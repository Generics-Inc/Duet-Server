import {Controller, Get, UseGuards} from '@nestjs/common';
import {AccessTokenGuard, HaveRoleAccessGuard} from "../auth/guard";
import {SessionsService} from "./sessions.service";
import {Roles, UserData} from "../users/decorator";
import {Role, Session} from "@prisma/client";
import {SessionIncludes} from "../types";
import {ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {SessionDto, SessionExtendDto} from "./dto";

@ApiTags('Сессии')
@UseGuards(AccessTokenGuard)
@Controller('sessions')
export class SessionsController {
    constructor(private sessionsService: SessionsService) {}

    @ApiOperation({ summary: 'ADMIN: Вывести все сессии всех пользователей' })
    @ApiResponse({ type: SessionDto, isArray: true })
    @ApiSecurity('AccessToken')
    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAll(): Promise<Session[]> {
        return this.sessionsService.getSessions();
    }
    @ApiOperation({ summary: 'ADMIN: Вывести все сессии всех пользователей в расширенном виде' })
    @ApiResponse({ type: SessionExtendDto, isArray: true })
    @ApiSecurity('AccessToken')
    @Get('full')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    getAllFull(): Promise<SessionIncludes[]> {
        return this.sessionsService.getSessions(undefined, true);
    }

    @ApiOperation({ summary: 'Вывести сессии авторизированного пользователя' })
    @ApiResponse({ type: SessionDto, isArray: true })
    @ApiSecurity('AccessToken')
    @Get('me/all')
    getMeAll(@UserData('id') userId: number): Promise<Session[]> {
        return this.sessionsService.getSessions({ userId });
    }
    @ApiOperation({ summary: 'Вывести сессии авторизированного пользователя в расширенном виде' })
    @ApiResponse({ type: SessionExtendDto, isArray: true })
    @ApiSecurity('AccessToken')
    @Get('me/all/full')
    getMeAllFull(@UserData('id') userId: number): Promise<SessionIncludes[]> {
        return this.sessionsService.getSessions({ userId }, true);
    }
}
