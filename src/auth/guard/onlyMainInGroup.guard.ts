import {ExecutionContext, Injectable} from "@nestjs/common";
import {HaveRoleAccessGuard} from "./haveRoleAccess.guard";
import {AccessWithoutMainRightsInGroupDividedException} from "../../errors";

@Injectable()
export class OnlyMainInGroupGuard extends HaveRoleAccessGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAccess = await super.canActivate(context);
    const isMainInGroup = !!this.data.profile?.mainGroup;

    if (!isMainInGroup) throw AccessWithoutMainRightsInGroupDividedException;

    return Boolean(isAccess);
  }
}
