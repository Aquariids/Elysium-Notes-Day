import { signIn, signOut, useSession } from "next-auth/react";
import MainPage from "../../../pages/mainPage/mainPage";
import s from './Entrance.module.scss';

const Entrance:  React.FunctionComponent = (): JSX.Element=> {
    const { data: session, status: loading } = useSession();
    console.log("(👍≖‿‿≖)👍 ✿ file: Entrance.tsx:7 ✿ data:", useSession())    
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
                    <MainPage/>
                    <button onClick={() => signOut()}> sign Out</button>
                </>
            )}
        </main>
        </>
    )
}


export default Entrance;


export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
