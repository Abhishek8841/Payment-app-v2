import { prisma } from "@repo/db/prisma";
import express, { Request, Response } from "express";
const app = express();

app.use(express.json());

// -> my db is not able to support transactions
// -> ideally do transactions in an app like this

app.post("/hdfcWebhook", async (req: Request, res: Response) => {
    // TODO: Add zod validation here?
    const paymentInformation: {
        token: string,
        userId: string,
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };
    try {
        const ans = await prisma.onRampTransaction.updateMany(
            {
                where: {
                    userId: Number(paymentInformation.userId),
                    status: "Processing",
                    token: paymentInformation.token,
                },
                data: {
                    status: "Success"
                }
            }
        );
        if (ans.count == 0) {
            return res.json({ message: "Already processed" })
        }
        await prisma.balance.updateMany(
            {
                where: {
                    userId: Number(paymentInformation.userId),
                    user: {
                        OnRampTransaction: {
                            some: {
                                token: paymentInformation.token,
                                status: "Success",
                                // we already have a guard in form of early return so no some needed here !!
                                // see this pattern !!
                            }
                        }
                    }
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount),
                    }
                }
            }
        );
        return res.json({ message: "captured" })
    } catch (error) {
        console.log("An error occured", error);
        return res.status(411).json(
            {
                message: "Some error occured"
            }
        )
    }
});
app.listen(3003);


// try {
//     const ans = await prisma.onRampTransaction.findMany(
//         {
//             where: {
//                 userId: Number(paymentInformation.userId),
//                 token: paymentInformation.token,
//                 status: "Processing"
//             }
//         }
//     );
//     if (ans.length == 0) {
//         throw new Error("Already processes the payment");
//     }

//     await prisma.$transaction([
//         prisma.balance.updateMany(
//             {
//                 where: {
//                     userId: Number(paymentInformation.userId),
//                 },
//                 data: {
//                     amount: {
//                         increment: Number(paymentInformation.amount),
//                     }
//                 }
//             }
//         ),
//         prisma.onRampTransaction.updateMany(
//             {
//                 where: {
//                     userId: Number(paymentInformation.userId),
//                     token: paymentInformation.token,
//                 },
//                 data: {
//                     status: "Success",
//                 }
//             }
//         )
//     ])
//     return res.json(
//         {
//             message: "captured",
//         }
//     )
// } catch (error) {
//     console.log(error);
//     res.status(500).json(
//         {
//             message: "Some error occured"
//         }
//     )
// }


// app.post("/hdfcWebhook", async (req: Request, res: Response) => {
//     // TODO: Add zod validation here?
//     const paymentInformation: {
//         token: string,
//         userId: string,
//         amount: string
//     } = {
//         token: req.body.token,
//         userId: req.body.user_identifier,
//         amount: req.body.amount
//     };
//     try {
//         const result = await prisma.$transaction(async (tx) => {
//             const ans = await tx.onRampTransaction.updateMany(
//                 {
//                     where: {
//                         userId: Number(paymentInformation.userId),
//                         status: "Processing",
//                         token: paymentInformation.token,
//                     },
//                     data: {
//                         status: "Success"
//                     }
//                 }
//             );
//             if (ans.count == 0) {
//                 return "already processed"
//             }
//             await tx.balance.updateMany(
//                 {
//                     where: {
//                         userId: Number(paymentInformation.userId),
//                         user: {
//                             OnRampTransaction: {
//                                 some: {
//                                     token: paymentInformation.token,
//                                     status: "Success",
//                                     // we already have a guard in form of early return so no some needed here !!
//                                     // see this pattern !!
//                                 }
//                             }
//                         }
//                     },
//                     data: {
//                         amount: {
//                             increment: Number(paymentInformation.amount),
//                         }
//                     }
//                 }
//             );
//         });
//         if (result == "already processed") { return res.json({ message: "Payment already done" }) };
//         return res.json({ message: "captured" })
//     } catch (error) {
//         console.log("An error occured", error);
//         return res.status(411).json(
//             {
//                 message: "Some error occured"
//             }
//         )
//     }
// });
// app.listen(3003);