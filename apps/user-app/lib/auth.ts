import { prisma } from "@repo/db/prisma"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                number: { label: "PhoneNumber", type: "text", placeholder: "JohnDoe" },
                password: { label: "password", type: "password", placeholder: "Password" },
            },
            async authorize(credentials) {
                //TODO: ADD ZOD
                if (!credentials?.number || !credentials?.password) {
                    return null;
                }
                try {
                    const alreadyExisting = await prisma.user.findFirst(
                        {
                            where: {
                                number: credentials?.number,
                            }
                        }
                    );
                    if (alreadyExisting) {
                        if (!(await bcrypt.compare(credentials?.password || "", alreadyExisting.password))) {
                            return null;
                        }
                        return {
                            id: String(alreadyExisting.id),
                            // number: alreadyExisting.number,
                        }
                    }
                    let hashedPassword: string;
                    try {
                        hashedPassword = await bcrypt.hash(credentials?.password || "", 10);
                    } catch (e) {
                        console.log("Unable to hash the password");
                        return null;
                    }
                    const newUser = await prisma.user.create(
                        {
                            data: {
                                number: credentials?.number || "00000000",
                                password: hashedPassword,
                            }
                        }
                    )
                    return {
                        id: String(newUser.id),
                        number: newUser.number,
                    }

                } catch (e) {
                    console.log("Error in authorize function");
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET || "secret",
    callbacks: {
        async jwt({ user, token }) {
            // Runs on sign-in
            if (user) {
                // user disappears after signin
                token.id = user.id
            }
            return token
        },
        async session({ token, session }) {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.id;
            }
            return session
        },
    },
}
