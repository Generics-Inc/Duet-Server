import {ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException} from "@nestjs/common";
import {Response} from "express";

@Catch(UnauthorizedException)
export class GuardianFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(401).json({
            statusCode: 401,
            errorCode: 0,
            message: ['Пользователь не авторизирован'],
        });
    }
}
