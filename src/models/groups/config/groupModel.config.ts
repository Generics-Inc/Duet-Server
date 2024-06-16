import {definePConfig} from "@root/helpers";
import {GroupMinimalPConfig} from "./groupMinimal.config";


export const GroupModelPConfig = definePConfig('Group', {
    ...GroupMinimalPConfig,
    mainProfileId: true,
    secondProfileId: true,
    inviteCode: true,
    relationStartedAt: true,
    updatedAt: true
});
