import { Card } from "@repo/ui/Card"

export async function P2PTransfers({
    transactions,
    user_identifier
}: {
    transactions: {
        id: number,
        amount: number,
        timestamp: Date,
        toUserId: number,
        fromUserId: number
    }[],
    user_identifier: number,
}) {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent P2P transactions
            </div>
        </Card>
    }
    return <Card title="Recent P2P Transactions">

        <br></br>
        <div className="pt-2">
            {transactions.map(t =>
                <div>
                    <div className="flex justify-between">
                        <div>
                            <div className="text-sm">
                                INR
                            </div>
                            <div className="flex flex-col justify-between">
                                <div className="text-blue-600 font-serif text-xs">
                                    {user_identifier == t.toUserId ? "Recieved" : "Sent"}                               </div>
                                <div className="text-slate-600 text-xs">
                                    {t.timestamp.toDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            + Rs {t.amount / 100}
                        </div>
                    </div>
                    <br></br>
                </div>)}
        </div>
    </Card>
}

