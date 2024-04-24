import {HttpException} from "@nestjs/common";

export class ExceptionGenerator extends HttpException {
    constructor(code: number, innerCode: number, ...message: string[]) {
        super({
            statusCode: code,
            errorCode: innerCode,
            message: message
        }, code);
    }
}
