import {definePConfig} from "@root/helpers";


export const SessionMinimalPConfig = definePConfig('Session', {
    id: true,
    userId: true,
    accountId: true,
    ip: true,
    current: true,
    deviceUUID: true,
    deviceName: true,
    deviceOS: true,
    createdAt: true,
    lastActivityAt: true
});
