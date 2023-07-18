import Head from 'next/head'
import React, { useState } from 'react';
import { getSession,useSession } from 'next-auth/react'


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
  const session = await getSession(context);
  
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


