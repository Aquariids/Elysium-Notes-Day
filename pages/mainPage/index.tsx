import { useSession, getSession } from 'next-auth/react';
import clientPromise from '../api/auth/lib/mongodb';
import React, { useState } from 'react';
import { withLayout } from '../../layout/Layout';
import Checkbox from '@/Components/Checkbox/Checkbox';
const MainPage = (chek: any) => {

    return (
       <><Checkbox/></>
    );
};

export default withLayout(MainPage);


export async function getServerSideProps(context: any) {
    const session = await getSession(context)
    if (!session) {
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