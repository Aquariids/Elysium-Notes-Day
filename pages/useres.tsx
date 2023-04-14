import React from 'react';
import clientPromise from './api/auth/lib/mongodb';
import { getSession, signIn, useSession } from 'next-auth/react';

const useres = ({ user }: any) => {
    console.log(user);

    let { data: session, status } = useSession();

    if (status === 'authenticated') {
        return (
            <div>
                {user.name}
            </div>
        );
    } else {
        return (
            <>
                <div>Произошла ошибка попробуйте снова авторизоваться</div>
                <button onClick={() => signIn()}> sign In</button>
            </>
        )
    }

};



export default useres;



export async function getServerSideProps(context: any) {
    const session = await getSession(context);

    try {
        const client = await clientPromise;
        const db = client.db('elysium');

        const user = await db
            .collection('users')
            .findOne({ email: session?.user.email })



        return {
            props: { user: JSON.parse(JSON.stringify(user)) }
        }
    }
    catch (e) {
        console.log(e);
    }
}
