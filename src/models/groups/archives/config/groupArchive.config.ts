import {GroupArchiveModelPConfig} from "./groupArchiveModel.config";
import {ProfileMinimalPConfig} from "@models/users/profiles/config";
import {GroupMinimalPConfig} from "@models/groups/config";
import {Prisma} from "@prisma/client";


export const GroupArchivePConfig: Prisma.GroupArchiveSelect = {
    ...GroupArchiveModelPConfig,
    profile: { select: ProfileMinimalPConfig },
    group: { select: GroupMinimalPConfig }
};
