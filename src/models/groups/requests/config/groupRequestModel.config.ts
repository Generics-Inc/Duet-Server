import {Prisma} from "@prisma/client";


export const GroupRequestModelPConfig: Prisma.GroupRequestSelect = {
    id: true,
    profileId: true,
    groupId: true,
    inviteCode: true,
    createdAt: true
};
