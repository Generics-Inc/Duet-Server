import {definePConfig} from "@root/helpers";


export const MovieSeriaPConfig = definePConfig('MovieSeria', {
    id: true,
    seasonId: true,
    number: true,
    name: true,
    releaseDate: true,
});
