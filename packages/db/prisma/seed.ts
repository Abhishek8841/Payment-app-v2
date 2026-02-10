import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
    const passwordAlice = await bcrypt.hash("alice", 10);
    const alice = await prisma.user.upsert({
        where: { number: '9999999999' },
        update: {},
        create: {
            number: '9999999999',
            password: passwordAlice,
            name: 'alice',
            OnRampTransaction: {
                create: {
                    startTime: new Date(),
                    status: "Success",
                    amount: 20000,
                    token: "122",
                    provider: "HDFC Bank",
                },
            },
        },
    })
    const passwordBob = await bcrypt.hash("Bob", 10);
    const bob = await prisma.user.upsert({
        where: { number: '9999999998' },
        update: {},
        create: {
            number: '9999999998',
            password: passwordBob,
            name: 'bob',
            OnRampTransaction: {
                create: {
                    startTime: new Date(),
                    status: "Failure",
                    amount: 2000,
                    token: "123",
                    provider: "HDFC Bank",
                },
            },
        },
    })
    console.log({ alice, bob })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        // @ts-ignore
        process.exit(1)
    })