import {Body, Controller, Delete, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Session} from "@prisma/client";
import {utils} from "@root/helpers";
import {SessionNotFoundException} from "@root/errors";
import {UserData, UserSession} from "@modules/users/decorator";
import {AccessTokenGuard} from "@modules/auth/guard";
import {SessionCloseDto, SessionDto} from "./dto";
import {SessionsService} from "./sessions.service";

@ApiTags('Сессии')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('sessions')
export class SessionsController {
    private utils = utils();

    constructor(private sessionsService: SessionsService) {}

    @ApiOperation({ summary: 'Вывести сессии авторизированного пользователя' })
    @ApiResponse({ type: SessionDto, isArray: true })
    @Get()
    async getMySessions(@UserData('id') userId: number, @UserSession() currentSession: Session) {
        return this.sessionsService.cleanSessionsData(await this.sessionsService.getSessions({ userId }), currentSession)
    }

    @ApiOperation({ summary: 'Вывести сессии авторизированного пользователя' })
    @ApiResponse({ type: SessionDto, isArray: true })
    @Get('me')
    getMe(@UserSession() currentSession: Session) {
        return this.sessionsService.cleanSessionData(currentSession, currentSession);
    }

    @ApiOperation({ summary: 'Закрыть сессию по ID' })
    @ApiResponse({ })
    @Delete('close/:id')
    async closeSessionById(@UserData('id') userId: number, @Param('id', ParseIntPipe) id: number) {
        this.utils.ifEmptyGivesError(await this.sessionsService.getSession({ userId, id }), SessionNotFoundException);
        await this.sessionsService.closeSessionsByArrayIds(userId, [id]);
    }
    @ApiOperation({ summary: 'Массовое закрытие сессий по ID' })
    @ApiBody({ type: SessionCloseDto })
    @Delete('close')
    async closeSessionsByIds(@UserData('id') userId: number, @Body() body: SessionCloseDto) {
        await this.sessionsService.closeSessionsByArrayIds(userId, body.ids);
    }
}
