import {Prisma} from "@prisma/client";
import {GroupMovieModelPConfig} from "./groupMovieModel.config";
import {GroupMovieCreateTaskModelPConfig} from "./groupMovieCreateTaskModel.config";

export const GroupMovieCreateTaskPConfig: Prisma.GroupMovieCreateTaskSelect  = {
    ...GroupMovieCreateTaskModelPConfig,
    groupMovie: { select: GroupMovieModelPConfig }
};
