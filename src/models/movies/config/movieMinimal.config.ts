import {definePConfig} from "@root/helpers";


export const MovieMinimalPConfig = definePConfig('Movie', {
    id: true,
    name: true,
    type: true,
    photo: true,
    updatedAt: true,
    createdAt: true,

    creatorId: true,
    originalName: true
});
