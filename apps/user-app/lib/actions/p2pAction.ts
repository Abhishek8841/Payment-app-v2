"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { prisma } from "@repo/db/prisma";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    // didn't add transactions coz my database wasn't supporting them
    // @ts-ignore
    const from = session?.user?.id;
    //  important never take this "from" -> userId from params always derive from session
    if (!from) {
        return {
            message: "Error while sending"
        }
    }
    try {
        const toUser = await prisma.user.findFirst({
            where: {
                number: to
            }
        });

        if (!toUser) {
            return {
                success: false,
                message: "User not found"
            }
        }
        // await prisma.$transaction(async (tx) => {

        // const fromBalance = await tx.balance.findUnique({
        //     where: { userId: Number(from) },
        // });
        // if (!fromBalance || fromBalance.amount < amount) {
        //     throw new Error('Insufficient funds');
        // }

        // like this we dont have to do manual locks
        // core idea is to do check and update in one atomic query !!! 
        const done = await prisma.balance.updateMany(
            {
                where: {
                    userId: Number(from),
                    amount: {
                        gte: amount,
                    },
                },
                data: {
                    amount: {
                        decrement: amount,
                    }
                }
            }
        )
        if (done.count == 0) {
            throw new Error('Insufficient funds');
        }

        await prisma.balance.update({
            where: { userId: Number(toUser.id) },
            data: { amount: { increment: amount } },
        });


        await prisma.p2pTransfer.create(
            {
                data: {
                    amount: amount,
                    fromUserId: Number(from),
                    toUserId: Number(toUser.id),
                    timestamp: new Date(),
                }
            }
        );

        // });
        return {
            success: true,
            message: "Transfer successfull"
        }
    } catch (e) {

        if ((e as { message?: string })?.message == "Insufficient funds") {
            console.log("Not sufficient funds in your account");
            return {
                success: false,
                message: "Insufficient funds",
            }
        }
        console.log("An error occured in actions/p2pAction -> ", e);
        return {
            success: false,
            message: "Error",
        }
    }
}

