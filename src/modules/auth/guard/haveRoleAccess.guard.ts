import {ExecutionContext, Injectable} from "@nestjs/common";
import {Role} from "@prisma/client";
import {Reflector} from "@nestjs/core";
import {RoleAccessDividedException} from "@root/errors";
import {ROLES_KEY} from "@modules/usersBase/decorator";
import {PayloadReturnDto} from "../strategy/dto";
import {AccessTokenGuard} from "./accessToken.guard";

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
