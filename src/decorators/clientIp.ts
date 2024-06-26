import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const ClientIp = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return ((request.headers['x-forwarded-for'] || '').split(',')[0] || request.ip).split(':').at(-1);
    },
);
