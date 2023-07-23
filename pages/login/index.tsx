import { getServerSession } from "next-auth/next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import s from './login.module.scss';


const Login:  React.FunctionComponent = (props): JSX.Element=> {
    console.log("🚀 ~ file: index.tsx:8 ~ props:", props)
    const { data: session, status: loading } = useSession();
    
    
      return  (
        <>
        <main className={s.main}>
            {!session && (
                <>
                    <p>Not signed in</p>
                    <button onClick={() => signIn()}> sign In</button>
                </>
            )}

            {session && (
                <div className={s.login}>
                    <p>{session.user.email}</p>
                    <button className={s.login_btn} onClick={() => signOut()}> Выйти </button>
                </div>
            )}
        </main>
        </>
    )
    
   
}


export default Login;



export async function getServerSideProps(context:any) {
  const session = await getServerSession(context.req, context.res, authOptions)
    console.log("🚀 ~ file: index.tsx:42 ~ getServerSideProps ~ session:", session)
    if (session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
    return {
      props: {
        session: await getServerSession(
          context.req,
          context.res,
          authOptions
        ),
      },
    }
  }