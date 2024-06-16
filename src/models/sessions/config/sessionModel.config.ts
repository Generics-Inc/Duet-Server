import {definePConfig} from "@root/helpers";
import {SessionMinimalPConfig} from "./sessionMinimal.config";


export const SessionModelPConfig = definePConfig('Session', {
    ...SessionMinimalPConfig,
    accessToken: true,
    refreshToken: true
});
