import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {SessionIncludes} from "../types";
import { Prisma, Session } from "@prisma/client";

@Injectable()
export class SessionsService {
    constructor(private prismaService: PrismaService) {}

    async getSessions<E extends boolean = false>(where?: Prisma.SessionWhereInput, extend?: E) {
        return (await this.prismaService.session.findMany({
            where: where,
            include: {
                user: extend
            }
        })) as E extends true ? SessionIncludes[] : Session[];
    }
}
