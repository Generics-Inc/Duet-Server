import {definePConfig} from "@root/helpers";


export const ProfileMinimalPConfig = definePConfig('Profile', {
    id: true,
    username: true,
    firstName: true,
    lastName: true,
    gender: true,
    description: true,
    photo: true,
    createdAt: true
});
