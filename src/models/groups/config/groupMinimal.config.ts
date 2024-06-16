import {definePConfig} from "@root/helpers";


export const GroupMinimalPConfig = definePConfig('Group', {
    id: true,
    name: true,
    description: true,
    photo: true,
    createdAt: true
});
