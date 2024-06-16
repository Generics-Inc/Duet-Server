import {definePConfig} from "@root/helpers";
import {GroupMovieModelPConfig} from "./groupMovieModel.config";
import {GroupMovieCreateTaskModelPConfig} from "./groupMovieCreateTaskModel.config";


export const GroupMovieCreateTaskPConfig = definePConfig('GroupMovieCreateTask', {
    ...GroupMovieCreateTaskModelPConfig,
    groupMovie: { select: GroupMovieModelPConfig }
});
