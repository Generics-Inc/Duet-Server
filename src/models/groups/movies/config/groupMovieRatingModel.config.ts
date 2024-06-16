import {definePConfig} from "@root/helpers";


export const GroupMovieRatingModelPConfig = definePConfig('GroupMovieRating', {
    id: true,
    profileId: true,
    groupMovieId: true,
    scope: true,
    createdAt: true
});
