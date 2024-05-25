import {Body, Controller, Delete, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Session} from "@prisma/client";
import {SessionDto} from "@models/sessions/dto";
import {UserData, UserSession} from "@modules/users/decorator";
import {AccessTokenGuard} from "@modules/auth/guard";
import {SessionCloseDto} from "./dto";
import {SessionsService} from "./sessions.service";

@ApiTags('Сессии')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('sessions')
export class SessionsController {
    constructor(private sessionsService: SessionsService) {}

    @ApiOperation({ summary: 'Вывести сессии авторизированного пользователя' })
    @ApiResponse({ type: SessionDto, isArray: true })
    @Get()
    async getMySessions(@UserData('id') userId: number, @UserSession() currentSession: Session) {
        return this.sessionsService.getCleanedSessionsByUserId(userId, currentSession);
    }

    @ApiOperation({ summary: 'Вывести сессии авторизированного пользователя' })
    @ApiResponse({ type: SessionDto, isArray: true })
    @Get('me')
    getMe(@UserSession() currentSession: Session) {
        return this.sessionsService.getCleanedSessionById(currentSession.id, currentSession);
    }

    @ApiOperation({ summary: 'Закрыть сессию по ID' })
    @ApiResponse({ })
    @Delete('close/:id')
    async closeSessionById(@UserData('id') userId: number, @Param('id', ParseIntPipe) id: number) {
        await this.sessionsService.closeSession(id, userId);
    }

    @ApiOperation({ summary: 'Массовое закрытие сессий по ID' })
    @ApiBody({ type: SessionCloseDto })
    @Delete('close')
    async closeSessionsByIds(@UserData('id') userId: number, @Body() body: SessionCloseDto) {
        await this.sessionsService.closeSessions(body.ids, userId);
    }
}