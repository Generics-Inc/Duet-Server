import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {PayloadReturnDto} from "../../auth/strategy/dto";

export const UserAuth = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        const sessionData = request.user as PayloadReturnDto;
        return sessionData ? data ? sessionData[data] : sessionData : null;
    }
);
