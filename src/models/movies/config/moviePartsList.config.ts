import {Prisma} from "@prisma/client";
import {MoviePartModelPConfig} from "./moviePartModel.config";

export const MoviePartsListPConfig: Prisma.MoviePartsListSelect = {
    id: true,
    parts: { select: MoviePartModelPConfig }
};
