import {definePConfig} from "@root/helpers";
import {GroupMinimalPConfig} from "@models/groups/config/groupMinimal.config";
import {ProfileMinimalPConfig} from "@models/users/profiles/config/profileMinimal.config";
import {GroupRequestModelPConfig} from "./groupRequestModel.config";


export const GroupRequestPConfig = definePConfig('GroupRequest', {
    ...GroupRequestModelPConfig,
    profile: { select: ProfileMinimalPConfig },
    group: { select: GroupMinimalPConfig }
});
