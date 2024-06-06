import {Prisma} from "@prisma/client";


export const UserMinimalPConfig: Prisma.UserSelect = {
    id: true,
    username: true,
    role: true,
    createdAt: true,
    updatedAt: true
};
