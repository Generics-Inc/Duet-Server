import {GroupMinimalPConfig} from "@models/groups/config/groupMinimal.config";
import {ProfileModelPConfig} from "./profileModel.config";
import {Prisma} from "@prisma/client";


export const ProfilePConfig: Prisma.ProfileSelect = {
    ...ProfileModelPConfig,
    mainGroup: { select: GroupMinimalPConfig },
    secondGroup: { select: GroupMinimalPConfig }
}
