import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "./lib/mongodb";
import NextAuth from 'next-auth'
import {NextAuthOptions, Session, User}   from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from "next-auth/providers/credentials";
import { getSession, useSession } from "next-auth/react";
import getUser from "./getUser";

const GITHUB_ID = process.env.GITHUB_ID as string;
const GITHUB_SECRET = process.env.GITHUB_SECRET as string;
const GOOGLE_ID = process.env.GOOGLE_ID as string;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET as string;
interface ExtendedSession extends Session {
  userId: string
}

const ses= getSession()

export const  authOptions:NextAuthOptions = {

  
adapter: MongoDBAdapter(clientPromise),

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
 
},

  providers: [

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "hi" , required: true  },
        // password: { label: "Password", type: "password",required: true  }
      },
      async authorize(credentials, req) {    
        if (!credentials?.email ) return null;
        const users = await getUser();

        
        

        return null;
      }
    }),
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
  ]


  
}


export default NextAuth(authOptions)
