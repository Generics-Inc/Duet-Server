import {Injectable} from '@nestjs/common';
import {Prisma, Session} from "@prisma/client";
import {PrismaService} from "@root/singles";
import {SessionIncludes} from "@root/types";
import {DeviceDto} from "./dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class SessionsModelService {
    private include: (keyof Prisma.SessionInclude)[] = ['user'];

    constructor(private prismaService: PrismaService) {}

    isTokenAlive(session: Session, access?: string, refresh?: string): boolean {
        let resultStatus = true;

        if (access && !bcrypt.compareSync(this.getTokenSignature(access), session.accessToken)) resultStatus = false;
        if (refresh && !bcrypt.compareSync(this.getTokenSignature(refresh), session.refreshToken)) resultStatus = false;

        return resultStatus;
    }

    createSession(userId: number, ip: string, device: DeviceDto, location?: any) {
        return this.prismaService.session.create({
            data: {
                user: { connect: { id: userId } },
                ip: ip,
                device: device as unknown as Prisma.JsonValue,
                location: location as unknown as Prisma.JsonValue
            }
        });
    }

    updateSession(id: number, data: Prisma.SessionUpdateInput) {
        return this.prismaService.session.update({
            where: { id },
            data
        });
    }

    getSessionById<E extends boolean = false>(id: number, extend?: E) {
        return this.getUniqueSession<E>({ id }, extend);
    }
    getSessionByIdAndUserId<E extends boolean = false>(id: number, userId: number, extend?: E) {
        return this.getUniqueSession<E>({ id, userId }, extend);
    }
    getSessionByIdAndUUID<E extends boolean = false>(id: number, uuid: string, extend?: E) {
        return this.getSession<E>({ id, device: { path: ['uuid'], equals: uuid } }, extend);
    }

    getSessionsByUserId<E extends boolean = false>(userId: number, extend?: E) {
        return this.getSessions<E>({ userId }, extend);
    }

    async deleteSessionById(id: number) {
        await this.prismaService.session.delete({ where: { id } });
    }
    async deleteSessionsByListIdAndUserId(ids: number[], userId: number) {
        await this.prismaService.session.deleteMany({ where: { id: { in: ids }, userId }});
    }

    getTokenSignature(token: string): string {
        return token.split('.').pop();
    }

    private async getSession<E extends boolean = false>(where?: Prisma.SessionWhereInput, extend?: E) {
        return (await this.prismaService.session.findFirst({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? SessionIncludes : Session;
    }
    private async getUniqueSession<E extends boolean = false>(where?: Prisma.SessionWhereUniqueInput, extend?: E) {
        return (await this.prismaService.session.findUnique({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? SessionIncludes : Session;
    }
    private async getSessions<E extends boolean = false>(where?: Prisma.SessionWhereInput, extend?: E) {
        return (await this.prismaService.session.findMany({
            where,
            include: this.include.reduce((a, c) => { a[c] = extend; return a; }, {})
        })) as E extends true ? SessionIncludes[] : Session[];
    }
}
