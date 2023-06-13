import { useSession, getSession } from 'next-auth/react';
import clientPromise from '../api/auth/lib/mongodb';
import React, { useState } from 'react';
import { withLayout } from '../../layout/Layout';
import Checkbox from '@/Components/Checkbox/Checkbox';
import TextEditor from '@/Components/TextEditor2/TextEditor';
import ToolPanel from '@/Components/ToolPanel2';
import ArticleEditor from '@/Components/TextEditor/ArticleEditor';
import dynamic from 'next/dynamic';
import CustomEditor from '@/Components/CustomEditor/CustomEditor';

const TextEditor2 = dynamic(
    () => import('@/Components/TextEditor/textEditor2'),
    { ssr: false }
)

const Text3 = dynamic(
    () => import('@/Components/TextEditor/Text3'),
    { ssr: false }
)

const MainPage = ({data}: any) => {

    
    return (
        
        <>
       <CustomEditor/>

        </>
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

