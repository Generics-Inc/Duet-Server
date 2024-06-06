import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from "bcryptjs";
import * as process from "node:process";

const prisma = new PrismaClient();

async function main(): Promise<void> {
    const usersCount = Number.parseInt(process.env.SEED_USERS_COUNT ?? '0');
    const adminsCount = Number.parseInt(process.env.SEED_ADMINS_COUNT ?? '0');

    for (let id = 0; id < usersCount + adminsCount; ++id) {
        const isAdmin = id > usersCount - 1;
        const idModify = id - (isAdmin ? usersCount: 0);
        const username = `${isAdmin ? 'admin' : 'user'}${idModify}`;

        const userData: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput> = {
            username,
            role: isAdmin ? 'ADMIN' : 'USER',
            password: bcrypt.hashSync(username, 10),
            profile: {
                connectOrCreate: {
                    where: { username },
                    create: {
                        firstName: `${isAdmin ? 'Админ' : 'Юзер'} #${idModify}`,
                        lastName: `${isAdmin ? 'Админов' : 'Юзеров'} #${idModify}`,
                        birthday: `01.01.${2000 + idModify}`
                    }
                }
            },
            connectedAccount: {
                create: {
                    UUID: `admin${idModify}@admin.ru`,
                    type: 'EMAIL'
                }
            }
        };

        await prisma.user.upsert({
            where: { username },
            update: userData,
            create: userData
        });
    }

    await prisma.superSecret.deleteMany();
    process.env.SECRET && await prisma.superSecret.createMany({
        data: (process.env.SECRET ?? '').split(';').map(el => ({ content: el.trim() }))
    });
}

main()
    .then(() => console.log('Сид базы данных - успешно инициализирован!'))
    .catch(e => { console.error(e); process.exit(1) })
    .finally(async () => await prisma.$disconnect());
