import {definePConfig} from "@root/helpers";
import {GroupArchiveModelPConfig} from "./groupArchiveModel.config";
import {ProfileMinimalPConfig} from "@models/users/profiles/config/profileMinimal.config";
import {GroupMinimalPConfig} from "@models/groups/config/groupMinimal.config";


export const GroupArchivePConfig = definePConfig('GroupArchive', {
    ...GroupArchiveModelPConfig,
    profile: { select: ProfileMinimalPConfig },
    partner: { select: ProfileMinimalPConfig },
    group: { select: GroupMinimalPConfig }
});
