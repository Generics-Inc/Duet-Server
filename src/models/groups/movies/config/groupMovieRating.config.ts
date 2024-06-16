import {definePConfig} from "@root/helpers";
import {ProfileMinimalPConfig} from "@models/users/profiles/config";
import {GroupMovieRatingModelPConfig} from "./groupMovieRatingModel.config";


export const GroupMovieRatingPConfig = definePConfig('GroupMovieRating', {
    ...GroupMovieRatingModelPConfig,
    profile: { select: ProfileMinimalPConfig }
});
