import {ProfileModelPConfig} from "./profileModel.config";
import {Prisma} from "@prisma/client";


export const ProfilePConfig: Prisma.ProfileSelect = {
    ...ProfileModelPConfig,
    mainGroup: true,
    secondGroup: true
}
