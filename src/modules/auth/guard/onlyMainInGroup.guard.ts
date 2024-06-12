import {ExecutionContext, Injectable} from "@nestjs/common";
import {AccessWithoutMainRightsInGroupDividedException} from "@root/errors";
import {HaveRoleAccessGuard} from "./haveRoleAccess.guard";

@Injectable()
export class OnlyMainInGroupGuard extends HaveRoleAccessGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAccess = await super.canActivate(context);
    const isMainInGroup = this.data.group ? this.data.group.mainProfileId === this.data.profile.id : false;

    if (!isMainInGroup) throw AccessWithoutMainRightsInGroupDividedException;

    return Boolean(isAccess);
  }
}
