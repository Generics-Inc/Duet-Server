import {ExecutionContext, Injectable} from "@nestjs/common";
import {AccessTokenGuard} from "./accessToken.guard";
import {RoleAccessDividedException} from "../../errors";
import {Reflector} from "@nestjs/core";
import {Role} from "@prisma/client";
import {ROLES_KEY} from "../../users/decorator";
import {PayloadReturnDto} from "../strategy/dto";

@Injectable()
export class HaveRoleAccessGuard extends AccessTokenGuard {
  protected data: PayloadReturnDto;

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const isTokenValid = await super.canActivate(context);
    this.data = context.switchToHttp().getRequest().user;
    const roleCheck = !requiredRoles ? true : requiredRoles.some(role => this.data.user.role === role);

    if (!roleCheck) throw RoleAccessDividedException;

    return Boolean(isTokenValid) && roleCheck;
  }
}
