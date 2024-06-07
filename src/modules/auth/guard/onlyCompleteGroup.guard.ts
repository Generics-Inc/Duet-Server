import {ExecutionContext, Injectable} from "@nestjs/common";
import {AccessWithIncompleteDividedException} from "@root/errors";
import {HaveRoleAccessGuard} from "./haveRoleAccess.guard";

@Injectable()
export class OnlyCompleteGroupGuard extends HaveRoleAccessGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAccess = await super.canActivate(context);
    const { group, profile } = this.data;

    if (!profile.groupId || !(group?.mainProfileId === profile.id ? group?.secondProfileId : group?.mainProfileId))
      throw AccessWithIncompleteDividedException;

    return Boolean(isAccess);
  }
}
