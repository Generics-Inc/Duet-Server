import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {PayloadReturnDto} from "@modules/auth/strategy/dto";

export const UserProfile = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        const profile = (request.user as PayloadReturnDto).profile;
        return profile ? data ? profile[data] : profile : null;
    }
);
