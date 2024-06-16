import {definePConfig} from "@root/helpers";


export const AccountModelPConfig = definePConfig('ConnectedAccount', {
    id: true,
    userId: true,
    UUID: true,
    type: true
});
