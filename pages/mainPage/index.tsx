import { useSession, getSession } from 'next-auth/react';
import clientPromise from '../api/auth/lib/mongodb';
import React, { useState } from 'react';
import { withLayout } from '../../layout/Layout';
import Checkbox from '@/Components/Checkbox/Checkbox';
import TextEditor from '@/Components/TextEditor/TextEditor';
import ToolPanel from '@/Components/TextEditor/ToolPanel';
import ArticleEditor from '@/Components/TextEditor/ArticleEditor';
import dynamic from 'next/dynamic';

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
        // <><Checkbox  /></>
        <>
        <ToolPanel />
        <TextEditor className={''} />
        {/* <TextEditor2 /> */
                // <Text3 />
            }
        {/* <ArticleEditor/> */}

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

