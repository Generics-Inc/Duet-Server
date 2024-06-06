import {Prisma} from "@prisma/client";
import {SessionMinimalPConfig} from "./sessionMinimal.config";


export const SessionModelPConfig: Prisma.SessionSelect = {
    ...SessionMinimalPConfig,
    accessToken: true,
    refreshToken: true
}
