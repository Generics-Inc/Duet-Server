import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {Role} from "@prisma/client";
import {PayloadReturnDto} from "@modules/auth/strategy/dto";

export const IsAdmin = createParamDecorator((data: undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        const user = (request.user as PayloadReturnDto).user;
        return user ? user.role === Role.ADMIN : null;
    }
);
