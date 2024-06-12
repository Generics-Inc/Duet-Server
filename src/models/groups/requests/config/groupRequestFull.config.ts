import {Prisma} from "@prisma/client";
import {GroupRequestModelPConfig} from "@models/groups/requests/config/groupRequestModel.config";
import {ProfileModelPConfig} from "@models/users/profiles/config/profileModel.config";
import {GroupModelPConfig} from "@models/groups/config/groupModel.config";


export const GroupRequestFullPConfig: Prisma.GroupRequestSelect = {
    ...GroupRequestModelPConfig,
    profile: { select: ProfileModelPConfig },
    group: { select: GroupModelPConfig }
};
