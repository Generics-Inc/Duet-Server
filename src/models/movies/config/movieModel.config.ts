import {definePConfig} from "@root/helpers";
import {MovieMinimalPConfig} from "./movieMinimal.config";


export const MovieModelPConfig = definePConfig('Movie', {
    ...MovieMinimalPConfig,
    genres: true,
    moderated: true,
    ageRating: true,
    partsListId: true,
    time: true,
    link: true,
    country: true,
    slogan: true,
    description: true,
    releaseDate: true
});
