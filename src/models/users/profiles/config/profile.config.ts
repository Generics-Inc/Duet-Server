import {definePConfig} from "@root/helpers";
import {GroupMinimalPConfig} from "@models/groups/config/groupMinimal.config";
import {ProfileModelPConfig} from "./profileModel.config";


export const ProfilePConfig = definePConfig('Profile', {
    ...ProfileModelPConfig,
    mainGroup: { select: GroupMinimalPConfig },
    secondGroup: { select: GroupMinimalPConfig }
});
