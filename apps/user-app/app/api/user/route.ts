import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";

export const GET = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user) {
            return NextResponse.json(
                {
                    message: session.user
                }
            )
        }
        return NextResponse.json(
            {
                message: "Pls login"
            }
        )
    } catch (e) {
        return NextResponse.json(
            {
                message: "failed to fetch"
            },
            {
                status: 400
            }
        )
    }
}