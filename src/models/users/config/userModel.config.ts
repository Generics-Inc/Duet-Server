import {definePConfig} from "@root/helpers";
import {UserMinimalPConfig} from "./userMinimal.config";


export const UserModelPConfig = definePConfig('User', {
    ...UserMinimalPConfig,
    password: true
});
