import {Prisma} from "@prisma/client";


export const SessionMinimalPConfig: Prisma.SessionSelect = {
    id: true,
    userId: true,
    ip: true,
    deviceUUID: true,
    deviceName: true,
    deviceOS: true,
    createdAt: true,
    lastActivityAt: true
}
