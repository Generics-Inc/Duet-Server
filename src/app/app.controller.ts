import {Controller, Get, UseGuards} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {PingDto, SecretDto} from "./dto";
import {HaveRoleAccessGuard} from "../auth/guard";
import {Roles} from "../users/decorator";
import {Role} from "@prisma/client";
import {AppService} from "./app.service";
import {OpenaiService} from "../singles/openai.service";

@ApiTags('Сервер')
@Controller()
export class AppController {
    constructor(
        private appService: AppService,
        private openaiService: OpenaiService
    ) {}

    @ApiOperation({ summary: 'Проверка работы сервера' })
    @ApiResponse({ status: 200, type: PingDto })
    @Get('ping')
    ping(): PingDto {
        return { message: 'pong1' };
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
