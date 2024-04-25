import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
    const adminData: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput> = {
        id: 0,
        username: 'admin',
        role: 'ADMIN',
        password: bcrypt.hashSync('admin', 10),
        profile: {
            connectOrCreate: {
                where: { username: 'admin' },
                create: {
                    id: 0,
                    firstName: 'Админ',
                    lastName: 'Админов',
                    birthday: '01.01.2000',
                    photo: 'https://vectorified.com/images/admin-logo-icon-16.jpg'
                }
            }
        }
    };

    await prisma.user.upsert({
        where: { username: 'admin' },
        update: adminData,
        create: adminData
    });

    await prisma.superSecret.deleteMany();
    process.env.SECRET && await prisma.superSecret.createMany({
        data: (process.env.SECRET ?? '').split(';').map(el => ({ content: el.trim() }))
    });
}

main()
    .then(() => console.log('Сид базы данных - успешно инициализирован!'))
    .catch(e => { console.error(e); process.exit(1) })
    .finally(async () => await prisma.$disconnect());
