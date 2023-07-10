import { getSession, signIn, signOut, useSession } from "next-auth/react";
import s from './login.module.scss';


const Login:  React.FunctionComponent = (): JSX.Element=> {
    const { data: session, status: loading } = useSession();
    
    return (
        <>
        <main className={s.main}>
            {/* <TextEditor/> */}

            {!session && (
                <>
                    <p>Not signed in</p>
                    <button onClick={() => signIn()}> sign In</button>
                </>
            )}

            {session && (
                <>
                    Signed in as {session.user.email} <br />
                    <button onClick={() => signOut()}> sign Out</button>
                </>
            )}
        </main>
        </>
    )
}


export default Login;



export async function getServerSideProps(context:any) {
    const session = await getSession(context)
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