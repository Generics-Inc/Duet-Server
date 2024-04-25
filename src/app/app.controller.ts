import {Controller, Get, UseGuards} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {PingDto, SecretDto} from "./dto";
import {HaveRoleAccessGuard} from "../auth/guard";
import {Roles} from "../users/decorator";
import {Role} from "@prisma/client";
import {AppService} from "./app.service";

@ApiTags('Сервер')
@Controller()
export class AppController {
    constructor(private appService: AppService) {}

    @ApiOperation({ summary: 'Проверка работы сервера' })
    @ApiResponse({ status: 200, type: PingDto })
    @Get('ping')
    ping(): PingDto {
        return { message: 'pong' };
    }

    @ApiOperation({ summary: 'СУПЕР СЕКРЕТНО' })
    @ApiSecurity('TokenAccess')
    @ApiResponse({ status: 200, type: SecretDto })
    @Get('secret')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    secret(): Promise<SecretDto> {
        return this.appService.secret();
    }
}
