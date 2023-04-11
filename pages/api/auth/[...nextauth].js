import NextAuth from "next-auth";
import GithubProvider  from "next-auth/providers/github";

    const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
                // Providers.Email({
                //     server: {
                //         host: "",
                //         port: "",
                //         auth: {
                //             user: "",
                //             pass: ""
                //         }

                //     },
                //     from: "",
                // })
    ],

    
}

export default NextAuth(authOptions)