"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import { prisma } from "@repo/db/prisma";

export async function onRampAction({ amount, provider }: {
    amount: number,
    provider: string,
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return {
                message: "User not logged in",
            }
        }
        const result = await prisma.onRampTransaction.create(
            {
                data: {
                    // @ts-ignore
                    userId: Number(session?.user.id),
                    token: Math.random().toString(),
                    startTime: new Date(),
                    amount: Number(amount) * 100,
                    status: "Processing",
                    provider
                }
            }
        )
        return {
            message: "On ramp transaction was successful",
            result
        }
    } catch (e) {
        console.log(e);
        return {
            message: "Transfer was unsuccessful",
        }
    }
}