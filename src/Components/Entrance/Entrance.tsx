import { signIn, signOut, useSession } from "next-auth/react";
import s from './Entrance.module.scss';

const Entrance:  React.FunctionComponent = (): JSX.Element=> {
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
                    <p>Диман ты в супер секретикс странице, отвечаю реально</p>
                    <button onClick={() => signOut()}> sign Out</button>
                </>
            )}
        </main>
        </>
    )
}


export default Entrance;


