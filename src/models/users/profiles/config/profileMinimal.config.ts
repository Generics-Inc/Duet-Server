import {Prisma} from "@prisma/client";


export const ProfileMinimalPConfig: Prisma.ProfileSelect = {
    id: true,
    username: true,
    firstName: true,
    lastName: true,
    gender: true,
    description: true,
    photo: true
};
