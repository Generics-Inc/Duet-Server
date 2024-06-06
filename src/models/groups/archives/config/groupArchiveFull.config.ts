import {GroupModelPConfig} from "@models/groups/config";
import {ProfileModelPConfig} from "@models/users/profiles/config";
import {GroupArchiveModelPConfig} from "./groupArchiveModel.config";
import {Prisma} from "@prisma/client";


export const GroupArchiveFullPConfig: Prisma.GroupArchiveSelect = {
    ...GroupArchiveModelPConfig,
    profile: { select: ProfileModelPConfig },
    group: { select: GroupModelPConfig }
};
