import {Controller, Get, UseGuards} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Role} from "@prisma/client";
import {Roles} from "@modules/users/decorator";
import {HaveRoleAccessGuard} from "@modules/auth/guard";
import {PingDto, SecretDto} from "./dto";
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
    @ApiResponse({ status: 200, type: SecretDto })
    @ApiSecurity('AccessToken')
    @Get('secret')
    @Roles(Role.ADMIN)
    @UseGuards(HaveRoleAccessGuard)
    secret(): Promise<SecretDto> {
        return this.appService.secret();
    }
}
