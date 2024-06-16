import {definePConfig} from "@root/helpers";
import {UserMinimalPConfig} from "@models/users/config/userMinimal.config";
import {AccountModelPConfig} from "./accountModel.config";


export const AccountPConfig = definePConfig('ConnectedAccount', {
    ...AccountModelPConfig,
    user: { select: UserMinimalPConfig }
});
