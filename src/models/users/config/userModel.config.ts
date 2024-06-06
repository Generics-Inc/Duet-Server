import {UserMinimalPConfig} from "./userMinimal.config";
import {Prisma} from "@prisma/client";


export const UserModelPConfig: Prisma.UserSelect = {
    ...UserMinimalPConfig,
    password: true
};
