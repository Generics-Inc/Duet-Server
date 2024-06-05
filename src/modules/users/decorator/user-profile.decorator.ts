import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {PayloadReturnDto} from "@modules/auth/strategy/dto";
import {ProfileIncludes} from "@root/types";

export const UserProfile = createParamDecorator((data: keyof ProfileIncludes | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        const profile = (request.user as PayloadReturnDto).profile;
        return profile ? data ? profile[data] : profile : null;
    }
);
