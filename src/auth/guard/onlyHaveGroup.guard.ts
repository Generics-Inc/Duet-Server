import {ExecutionContext, Injectable} from "@nestjs/common";
import {HaveRoleAccessGuard} from "./haveRoleAccess.guard";
import {AccessWithGroupDividedException} from "../../errors";

@Injectable()
export class OnlyHaveGroupGuard extends HaveRoleAccessGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAccess = await super.canActivate(context);
    const profile = this.data.profile;

    if (!profile.groupId) throw AccessWithGroupDividedException;

    return Boolean(isAccess);
  }
}
