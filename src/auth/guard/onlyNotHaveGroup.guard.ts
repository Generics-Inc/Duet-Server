import {ExecutionContext, Injectable} from "@nestjs/common";
import {HaveRoleAccessGuard} from "./haveRoleAccess.guard";
import {AccessWithoutGroupDividedException} from "../../errors";

@Injectable()
export class OnlyNotHaveGroupGuard extends HaveRoleAccessGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAccess = await super.canActivate(context);

    if (this.data.profile.groupId) throw AccessWithoutGroupDividedException;

    return Boolean(isAccess);
  }
}
