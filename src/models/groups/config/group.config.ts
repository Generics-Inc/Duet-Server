import {definePConfig} from "@root/helpers";
import {GroupArchiveModelPConfig} from "@models/groups/archives/config/groupArchiveModel.config";
import {GroupRequestModelPConfig} from "@models/groups/requests/config/groupRequestModel.config";
import {ProfileMinimalPConfig} from "@models/users/profiles/config/profileMinimal.config";
import {GroupModelPConfig} from "./groupModel.config";


export const GroupPConfig = definePConfig('Group', {
    ...GroupModelPConfig,
    archives: { select: GroupArchiveModelPConfig },
    requests: { select: GroupRequestModelPConfig },
    mainProfile: { select: ProfileMinimalPConfig },
    secondProfile: { select: ProfileMinimalPConfig }
});
