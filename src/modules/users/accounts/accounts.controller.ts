import {ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Controller, Get, UseGuards} from '@nestjs/common';
import {AccessTokenGuard} from "@modules/auth/guard";
import {UsersAccountsService} from "@modules/users/accounts/accounts.service";
import {UserData, UserTokenPayload} from "@modules/users/decorator";
import {AccountModelDto} from "@models/users/accounts/dto";


@ApiTags('Подключённые аккаунты')
@ApiSecurity('AccessToken')
@UseGuards(AccessTokenGuard)
@Controller('accounts')
export class UsersAccountsController {
    constructor(private selfService: UsersAccountsService) {}

    @ApiOperation({ summary: 'Вывести список подключенных к активному пользователю аккаунтов' })
    @ApiResponse({ type: AccountModelDto, isArray: true })
    @Get()
    getMyAccounts(@UserData('id') id: number) {
        return this.selfService.getModel().getManyModalByUserId(id);
    }

    @ApiOperation({ summary: 'Вывести активный аккаунт' })
    @ApiResponse({ type: AccountModelDto })
    @Get('me')
    getActiveAccount(@UserTokenPayload('accountId') accountId: number) {
        return this.selfService.getModel().getModalById(accountId);
    }
}
