import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {PayloadReturnDto} from "@modules/auth/strategy/dto";

export const UserAuth = createParamDecorator((data: keyof PayloadReturnDto | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        const sessionData = request.user as PayloadReturnDto;
        return sessionData ? data ? sessionData[data] : sessionData : null;
    }
);
