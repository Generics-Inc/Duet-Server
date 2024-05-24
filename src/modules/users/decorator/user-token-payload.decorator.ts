import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {PayloadReturnDto} from "@modules/auth/strategy/dto";

export const UserTokenPayload = createParamDecorator((data: undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        const payload = (request.user as PayloadReturnDto).tokenPayload;
        return payload ?? null;
    }
);
