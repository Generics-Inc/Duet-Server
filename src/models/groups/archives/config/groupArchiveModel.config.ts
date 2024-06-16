import {definePConfig} from "@root/helpers";


export const GroupArchiveModelPConfig = definePConfig('GroupArchive', {
    id: true,
    groupId: true,
    profileId: true,
    partnerId: true,
    createdAt: true
});
