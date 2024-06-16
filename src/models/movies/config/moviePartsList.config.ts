import {definePConfig} from "@root/helpers";
import {MoviePartModelPConfig} from "./moviePartModel.config";


export const MoviePartsListPConfig = definePConfig('MoviePartsList', {
    id: true,
    parts: { select: MoviePartModelPConfig }
});
