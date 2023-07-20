import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import type { AuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import clientPromise from "../pages/api/auth/lib/mongodb";
import { Session } from "next-auth";


interface ExtendedSession extends Session {
    userId: string;
  }

const GOOGLE_ID = process.env.GOOGLE_ID as string;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET as string;

export const authConfig: AuthOptions = {
    
adapter: MongoDBAdapter(clientPromise),

  providers: [
    Google({
      clientId: GOOGLE_ID!,
      clientSecret: GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    session: async ({ session, user }) => {
      const newSession = session as ExtendedSession;
      newSession.user.userId = user.id;
      return newSession;
    },
  },
}