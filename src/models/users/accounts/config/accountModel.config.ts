import {Prisma} from "@prisma/client";


export const AccountModelPConfig: Prisma.ConnectedAccountSelect = {
    id: true,
    userId: true,
    UUID: true,
    type: true
};
