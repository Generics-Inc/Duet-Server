import { Prisma } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import $Result = runtime.Types.Result

type PrismaTableType = {
    objects: { [name: string]: any };
    scalars: { [name: string]: any };
};
type PrismaIncludes<T extends PrismaTableType> = T['scalars'] & {
    [Key in keyof T['objects']]: $Result.DefaultSelection<T['objects'][Key]>;
};

export type UserIncludes = PrismaIncludes<Prisma.$UserPayload>;
export type ProfileIncludes = PrismaIncludes<Prisma.$ProfilePayload>;
export type GroupIncludes = PrismaIncludes<Prisma.$GroupPayload>;
export type GroupArchiveIncludes = PrismaIncludes<Prisma.$GroupArchivePayload>;
export type SessionIncludes = PrismaIncludes<Prisma.$SessionPayload>;
