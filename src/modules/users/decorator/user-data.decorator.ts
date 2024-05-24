import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {PayloadReturnDto} from "@modules/auth/strategy/dto";

export const UserData = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        const user = (request.user as PayloadReturnDto).user;
        return user ? data ? user[data] : user : null;
    }
);
