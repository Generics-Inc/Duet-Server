import {GroupModelPConfig} from "@models/groups/config/groupModel.config";
import {GroupArchiveModelPConfig} from "./groupArchiveModel.config";
import {Prisma} from "@prisma/client";
import {ProfileFullPConfig} from "@models/users/profiles/config";


export const GroupArchiveFullPConfig: Prisma.GroupArchiveSelect = {
    ...GroupArchiveModelPConfig,
    profile: { select: ProfileFullPConfig },
    partner: { select: ProfileFullPConfig },
    group: { select: GroupModelPConfig }
};
