import {Prisma} from "@prisma/client";
import {GroupArchiveModelPConfig} from "@models/groups/archives/config/groupArchiveModel.config";
import {GroupRequestModelPConfig} from "@models/groups/requests/config/groupRequestModel.config";
import {ProfileMinimalPConfig} from "@models/users/profiles/config/profileMinimal.config";
import {GroupModelPConfig} from "./groupModel.config";


export const GroupPConfig: Prisma.GroupSelect = {
    ...GroupModelPConfig,
    groupArchives: { select: GroupArchiveModelPConfig },
    groupRequests: { select: GroupRequestModelPConfig },
    mainProfile: { select: ProfileMinimalPConfig },
    secondProfile: { select: ProfileMinimalPConfig }
};
