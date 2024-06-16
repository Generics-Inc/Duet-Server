import {definePConfig} from "@root/helpers";


export const GroupRequestModelPConfig = definePConfig('GroupRequest', {
    id: true,
    profileId: true,
    groupId: true,
    inviteCode: true,
    createdAt: true
});
