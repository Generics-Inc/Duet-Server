import {GroupModelPConfig} from "@models/groups/config/groupModel.config";
import {ProfileModelPConfig} from "@models/users/profiles/config/profileModel.config";
import {GroupArchiveModelPConfig} from "./groupArchiveModel.config";
import {Prisma} from "@prisma/client";


export const GroupArchiveFullPConfig: Prisma.GroupArchiveSelect = {
    ...GroupArchiveModelPConfig,
    profile: { select: ProfileModelPConfig },
    partner: { select: ProfileModelPConfig },
    group: { select: GroupModelPConfig }
};
