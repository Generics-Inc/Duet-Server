import {definePConfig} from "@root/helpers";


export const MovieRatingPConfig = definePConfig('MovieRating', {
    id: true,
    movieId: true,
    providerName: true,
    countOfScopes: true,
    scope: true
});
