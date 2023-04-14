import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import TextEditor from '@/TextEditor/TextEditor'
import React, { useState } from 'react';
import Link from 'next/link';
import { withLayout } from '../layout/Layout';
import clientPromise from './api/auth/lib/mongodb';
import MainPage from './mainPage';
import { getSession } from 'next-auth/react'
import Login from './login';


function Home({ user }: any) {
  return (
    <>
      <Head>
        <title>Elysium notes day</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
    </>
  )
}




export default Home;

export async function getServerSideProps(context:any) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  } 
  else {
    return {
      redirect: {
        destination: '/mainPage',
        permanent: false,
      },
    }
  }
}



// export async function getServerSideProps(context: any) {
//   const session = await getSession(context);

//   try {
//     const client = await clientPromise;
//     const db = client.db('notes');

//     const user = await db
//       .collection('chek').insertOne({userId: session?.user.email})



//     return {
//       props: { user: JSON.parse(JSON.stringify(user)) }
//     }
//   }
//   catch (e) {
//     console.log(e);
//   }
// }