import { getSession } from 'next-auth/react';
import React, { useState } from 'react';
import { withLayout } from '../../layout/Layout';
import CustomEditor from '@/Components/CustomEditor/CustomEditor';


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

