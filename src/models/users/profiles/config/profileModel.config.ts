import {ProfileMinimalPConfig} from "./profileMinimal.config";
import {Prisma} from "@prisma/client";


export const ProfileModelPConfig: Prisma.ProfileSelect = {
    ...ProfileMinimalPConfig,
    birthday: true,
    vkId: true,
    updatedAt: true
};