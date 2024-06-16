import {definePConfig} from "@root/helpers";
import {GroupMovieModelPConfig} from "@models/groups/movies/config/groupMovieModel.config";
import {GroupMovieCreateTaskModelPConfig} from "@models/groups/movies/config/groupMovieCreateTaskModel.config";
import {MovieMinimalPConfig} from "@models/movies/config";
import {ProfileMinimalPConfig} from "@models/users/profiles/config";


export const GroupMovieMinimalPConfig = definePConfig('GroupMovie', {
    ...GroupMovieModelPConfig,
    taskCreate: { select: GroupMovieCreateTaskModelPConfig },
    movie: { select: MovieMinimalPConfig },
    creator: { select: ProfileMinimalPConfig }
});
