import { useSession, getSession } from 'next-auth/react';
import clientPromise from '../api/auth/lib/mongodb';
import React, { useState } from 'react';
import { withLayout } from '../../layout/Layout';
import Checkbox from '@/Components/Checkbox/Checkbox';
import TextEditor from '@/TextEditor/TextEditor';
const MainPage = ({data}: any) => {
console.log("(👍≖‿‿≖)👍 ✿ file: index.tsx:7 ✿ MainPage ✿ data:", data)

    return (
        <><Checkbox  /></>
        // <TextEditor/>
    );
};



export async function getServerSideProps(context: any) {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    
}


return {
    props: {}
}

        
    

}


export default withLayout(MainPage);

