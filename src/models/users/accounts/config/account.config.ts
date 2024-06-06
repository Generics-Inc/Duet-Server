import {Prisma} from "@prisma/client";
import {UserMinimalPConfig} from "@models/users/config";
import {AccountModelPConfig} from "./accountModel.config";


export const AccountPConfig: Prisma.ConnectedAccountSelect = {
    ...AccountModelPConfig,
    user: { select: UserMinimalPConfig }
};
