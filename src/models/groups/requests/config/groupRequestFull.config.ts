import {definePConfig} from "@root/helpers";
import {ProfileModelPConfig} from "@models/users/profiles/config/profileModel.config";
import {GroupModelPConfig} from "@models/groups/config/groupModel.config";
import {GroupRequestModelPConfig} from "./groupRequestModel.config";


export const GroupRequestFullPConfig = definePConfig('GroupRequest', {
    ...GroupRequestModelPConfig,
    profile: { select: ProfileModelPConfig },
    group: { select: GroupModelPConfig }
});
