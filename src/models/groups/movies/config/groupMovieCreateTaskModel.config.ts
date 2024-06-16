import {definePConfig} from "@root/helpers";


export const GroupMovieCreateTaskModelPConfig = definePConfig('GroupMovieCreateTask', {
    id: true,
    groupMovieId: true,
    link: true,
    name: true,
    addName: true,
    type: true,
    isError: true,
    createdAt: true,
    updatedAt: true
});
