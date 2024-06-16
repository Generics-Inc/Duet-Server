import {definePConfig} from "@root/helpers";


export const MovieModelPConfig = definePConfig('Movie', {
    id: true,
    name: true,
    type: true,
    photo: true,
    moderated: true,
    updatedAt: true,
    createdAt: true,
    genres: true,

    creatorId: true,
    ageRating: true,
    time: true,
    link: true,
    country: true,
    originalName: true,
    slogan: true,
    description: true,
    releaseDate: true
});
