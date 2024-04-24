import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {PayloadReturnDto} from "../../auth/strategy/dto/payload.dto";

export const UserTokenPayload = createParamDecorator((data: undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        const payload = (request.user as PayloadReturnDto).tokenPayload;
        return payload ?? null;
    }
);
