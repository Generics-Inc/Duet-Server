import { Prisma } from "@prisma/client";
import {GroupRequestModelPConfig} from "./groupRequestModel.config";
import {GroupMinimalPConfig} from "@models/groups/config";
import {ProfileMinimalPConfig} from "@models/users/profiles/config";


export const GroupRequestPConfig: Prisma.GroupRequestSelect = {
    ...GroupRequestModelPConfig,
    profile: { select: ProfileMinimalPConfig },
    group: { select: GroupMinimalPConfig }
};
