import {definePConfig} from "@root/helpers";
import {GroupArchiveModelPConfig} from "@models/groups/archives/config/groupArchiveModel.config";
import {ProfilePConfig} from "./profile.config";


export const ProfileFullPConfig = definePConfig('Profile', {
    ...ProfilePConfig,
    groupsArchives: { select: GroupArchiveModelPConfig }
});
