import {Controller, Get} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PingDto} from "./dto";

@ApiTags('Сервер')
@Controller()
export class AppController {
    @ApiOperation({ summary: 'Проверка работы сервера' })
    @ApiResponse({ status: 200, type: PingDto })
    @Get('ping')
    ping() {
        return { message: 'pong' };
    }
}
