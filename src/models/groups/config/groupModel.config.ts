import {GroupMinimalPConfig} from "./groupMinimal.config";
import { Prisma } from "@prisma/client";


export const GroupModelPConfig: Prisma.GroupSelect = {
    ...GroupMinimalPConfig,
    mainProfileId: true,
    secondProfileId: true,
    inviteCode: true,
    relationStartedAt: true,
    updatedAt: true
};
