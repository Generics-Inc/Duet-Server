import {Controller, UseGuards} from '@nestjs/common';
import {ApiSecurity, ApiTags} from "@nestjs/swagger";
import {OnlyHaveGroupGuard} from "@modules/auth/guard";

@ApiTags('Раздел "Кино"')
@ApiSecurity('AccessToken')
@UseGuards(OnlyHaveGroupGuard)
@Controller('movies')
export class MoviesController {}
