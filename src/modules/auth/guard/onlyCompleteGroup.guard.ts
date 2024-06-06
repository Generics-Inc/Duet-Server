import {ExecutionContext, Injectable} from "@nestjs/common";
import {AccessWithIncompleteDividedException} from "@root/errors";
import {HaveRoleAccessGuard} from "./haveRoleAccess.guard";

@Injectable()
export class OnlyCompleteGroupGuard extends HaveRoleAccessGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAccess = await super.canActivate(context);
    const { group: { mainProfileId, secondProfileId }, ...profile } = this.data.profile;

    if (!profile.groupId || !(mainProfileId === profile.id ? secondProfileId : mainProfileId)) throw AccessWithIncompleteDividedException;

    return Boolean(isAccess);
  }
}
