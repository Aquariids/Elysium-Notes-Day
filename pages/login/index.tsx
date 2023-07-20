import { getSession, signIn, signOut, useSession } from "next-auth/react";
import s from './login.module.scss';


const Login:  React.FunctionComponent = (): JSX.Element=> {
    const { data: session, status: loading } = useSession();
    
    if(loading === 'loading') {
      return(<>
      Загрузка профиля
      </>)
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
                    <p>{session.user.email}</p>
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