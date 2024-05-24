import { Injectable } from '@nestjs/common';
import {PrismaService} from "@root/singles";
import {SecretDto} from "./dto";

@Injectable()
export class AppService {
    constructor(private prismaService: PrismaService) {}

    async secret(): Promise<SecretDto> {
        const countOfRecords = await this.prismaService.superSecret.count();
        const randomRecordIndex = Math.floor(Math.random() * countOfRecords);
        return {
            message: await this.prismaService.superSecret.findMany({
                take: 1,
                skip: randomRecordIndex
            }).then(res => res[0]?.content ?? 'Контент не найден')
        };
    }
}
