import {definePConfig} from "@root/helpers";
import {ProfileMinimalPConfig} from "./profileMinimal.config";


export const ProfileModelPConfig = definePConfig('Profile', {
    ...ProfileMinimalPConfig,
    birthday: true,
    updatedAt: true
});
