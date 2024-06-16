import {definePConfig} from "@root/helpers";


export const MoviePartModelPConfig = definePConfig('MoviePart', {
    link: true,
    releaseYear: true,
    name: true,
    type: true,
    current: true,

    rating: true,
    partsListId: true,
    movieId: true
});
