import {Prisma} from "@prisma/client";


export const GroupArchiveModelPConfig: Prisma.GroupArchiveSelect = {
    id: true,
    groupId: true,
    profileId: true,
    createdAt: true
};
