import {ExecutionContext, Injectable} from "@nestjs/common";
import {AccessWithGroupDividedException} from "@root/errors";
import {HaveRoleAccessGuard} from "./haveRoleAccess.guard";

@Injectable()
export class OnlyHaveGroupGuard extends HaveRoleAccessGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAccess = await super.canActivate(context);
    const profile = this.data.profile;

    if (!profile.groupId) throw AccessWithGroupDividedException;

    return Boolean(isAccess);
  }
}
