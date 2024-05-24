import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {PayloadReturnDto} from "@modules/auth/strategy/dto";

export const UserSession = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        const profile = (request.user as PayloadReturnDto).session;
        return profile ? data ? profile[data] : profile : null;
    }
);
