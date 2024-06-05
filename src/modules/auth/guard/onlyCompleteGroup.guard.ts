import {ExecutionContext, Injectable} from "@nestjs/common";
import {AccessWithIncompleteDividedException} from "@root/errors";
import {HaveRoleAccessGuard} from "./haveRoleAccess.guard";

@Injectable()
export class OnlyCompleteGroupGuard extends HaveRoleAccessGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAccess = await super.canActivate(context);
    const { mainGroup, secondGroup, ...profile } = this.data.profile;

    if (!profile.groupId || !(mainGroup?.secondProfileId || secondGroup?.mainProfileId)) throw AccessWithIncompleteDividedException;

    return Boolean(isAccess);
  }
}
