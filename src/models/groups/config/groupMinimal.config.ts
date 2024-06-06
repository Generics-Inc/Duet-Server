import { Prisma } from "@prisma/client";


export const GroupMinimalPConfig: Prisma.GroupSelect = {
    id: true,
    name: true,
    description: true,
    photo: true,
    createdAt: true
};
