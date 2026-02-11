import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCardComponent";
import { authOptions } from "../../../lib/auth";
import { prisma } from "@repo/db/prisma";
import { BalanceCard } from "../../../components/BalanceCard";
import { P2PTransfers } from "../../../components/p2pTransfers";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            // @ts-ignore
            userId: Number(session?.user.id),
        }
    })
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0,
    };
}

async function getP2Ptransfers() {
    const session = await getServerSession(authOptions);
    const tsxns = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                // @ts-ignore
                { toUserId: Number(session?.user.id) },
                // @ts-ignore
                { fromUserId: Number(session?.user.id) },
            ]
        }
    });
    return tsxns;
}

export default async function () {
    const session = await getServerSession(authOptions);
    const balance = await getBalance();
    const transactions = await getP2Ptransfers();
    return <div className="w-full">        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer
    </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <SendCard></SendCard>
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    {/* @ts-ignore */}
                    <P2PTransfers transactions={transactions} user_identifier={Number(session?.user.id)}></P2PTransfers>
                </div>
            </div>
        </div>
    </div>
}