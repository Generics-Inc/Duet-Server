import {definePConfig} from "@root/helpers";


export const GroupMovieModelPConfig = definePConfig('GroupMovie', {
    id: true,
    groupId: true,
    creatorId: true,
    isWatched: true,
    moreToWatch: true,
    createdAt: true,
    updatedAt: true,

    movieId: true
});
