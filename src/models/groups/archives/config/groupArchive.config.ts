import {GroupArchiveModelPConfig} from "./groupArchiveModel.config";
import {ProfileMinimalPConfig} from "@models/users/profiles/config/profileMinimal.config";
import {GroupMinimalPConfig} from "@models/groups/config/groupMinimal.config";
import {Prisma} from "@prisma/client";


export const GroupArchivePConfig: Prisma.GroupArchiveSelect = {
    ...GroupArchiveModelPConfig,
    profile: { select: ProfileMinimalPConfig },
    partner: { select: ProfileMinimalPConfig },
    group: { select: GroupMinimalPConfig }
};
