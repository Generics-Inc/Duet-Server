import {Controller, Get} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('Сервер')
@Controller()
export class AppController {
    @ApiOperation({summary: 'Проверка работы сервера'})
    @Get('ping')
    ping() {
        return {message: 'pong'};
    }
}
