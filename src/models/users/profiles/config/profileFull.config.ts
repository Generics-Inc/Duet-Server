import {Prisma} from "@prisma/client";
import {ProfilePConfig} from "@models/users/profiles/config/profile.config";
import {GroupArchiveModelPConfig} from "@models/groups/archives/config/groupArchiveModel.config";


export const ProfileFullPConfig: Prisma.ProfileSelect = {
    ...ProfilePConfig,
    groupsArchives: { select: GroupArchiveModelPConfig }
}
