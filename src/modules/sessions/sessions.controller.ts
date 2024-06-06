import {Body, Controller, Delete, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Session} from "@prisma/client";
import {UserData, UserSession} from "@modules/users/decorator";
import {AccessTokenGuard} from "@modules/auth/guard";
import {SessionCloseDto} from "./dto";
import {SessionsService} from "./sessions.service";
import {SessionMinimalDto} from "@models/sessions/dto";


@ApiTags('Сессии')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('sessions')
export class SessionsController {
    constructor(private sessionsService: SessionsService) {}

    @ApiOperation({ summary: 'Вывести сессии авторизированного пользователя' })
    @ApiResponse({ type: SessionMinimalDto, isArray: true })
    @Get()
    async getMySessions(@UserData('id') userId: number, @UserSession() currentSession: Session) {
        return this.sessionsService.prepareSessionsDataByUserId(userId, currentSession);
    }

    @ApiOperation({ summary: 'Вывести активную сессию авторизированного пользователя' })
    @ApiResponse({ type: SessionMinimalDto })
    @Get('me')
    getCurrentSession(@UserSession() currentSession: Session) {
        return this.sessionsService.prepareSessionDataById(currentSession.id, currentSession);
    }

    @ApiOperation({ summary: 'Закрыть сессию по ID' })
    @ApiParam({ description: 'Id сессии', name: 'id', type: Number })
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
