import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      image: any
      token: any
      email: string
      /** The user's postal address. */
      address: string
      name: string
      id:number
      userId:string
    }
  }
}


