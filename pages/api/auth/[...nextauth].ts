import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "./lib/mongodb";
import NextAuth from 'next-auth'
import {NextAuthOptions, Session}   from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'


const GITHUB_ID = process.env.GITHUB_ID as string;
const GITHUB_SECRET = process.env.GITHUB_SECRET as string;
const GOOGLE_ID = process.env.GOOGLE_ID as string;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET as string;
interface ExtendedSession extends Session {
  userId: string
}

export const  authOptions:NextAuthOptions = {

  
adapter: MongoDBAdapter(clientPromise),

  providers: [
    GitHub({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  ],

  callbacks: {
 
    session: async ({ session, user}) => {
        if(!session.user.userId){
          const newSession = session as ExtendedSession
          newSession.user.userId = user.id
          return newSession
         
        } else {
          return session;
        }
       
    
    }
   
  }
  
}


export default NextAuth(authOptions)
