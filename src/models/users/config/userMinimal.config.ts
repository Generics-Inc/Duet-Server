import {definePConfig} from "@root/helpers";


export const UserMinimalPConfig = definePConfig('User', {
    id: true,
    username: true,
    role: true,
    createdAt: true,
    updatedAt: true
});
