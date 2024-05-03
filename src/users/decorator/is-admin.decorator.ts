import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {PayloadReturnDto} from "../../auth/strategy/dto";
import {Role} from "@prisma/client";

export const IsAdmin = createParamDecorator((data: undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        const user = (request.user as PayloadReturnDto).user;
        return user ? user.role === Role.ADMIN : null;
    }
);
