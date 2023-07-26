import { getServerSession } from "next-auth/next";
import { signIn, signOut, useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import Loader from "./Loader";
import s from './login.module.scss';


const Login:  React.FunctionComponent = (): JSX.Element=> {
    const { data: session, status: loading } = useSession();
    
    if(loading == 'loading') {
      return(<Loader/>)
    } else {
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
                    <p style={{color:'#fff'}}>{session.user.email}</p>
                    <button className={s.login_btn} onClick={() => signOut()}> Выйти </button>
                </div>
            )}
        </main>
        </>
    )
    }

    
    
   
}


export default Login;



export async function getServerSideProps(context:any) {
  const session = await getServerSession(context.req, context.res, authOptions)
    if (session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
    return {
      props: {},
    }
  }