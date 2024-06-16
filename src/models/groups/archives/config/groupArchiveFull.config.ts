import {definePConfig} from "@root/helpers";
import {GroupModelPConfig} from "@models/groups/config/groupModel.config";
import {ProfileFullPConfig} from "@models/users/profiles/config";
import {GroupArchiveModelPConfig} from "./groupArchiveModel.config";


export const GroupArchiveFullPConfig = definePConfig('GroupArchive', {
    ...GroupArchiveModelPConfig,
    profile: { select: ProfileFullPConfig },
    partner: { select: ProfileFullPConfig },
    group: { select: GroupModelPConfig }
});
