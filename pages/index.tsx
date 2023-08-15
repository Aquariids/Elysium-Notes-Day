import Head from "next/head";
import React, { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { NOTES } from "./api/paths";
import { withLayout } from "../layout/Layout";
import Link from "next/link";
import { useRouter } from "next/router";

function Home({ data }: any) {
  return (
    <>
      <Head>
        <title>Elysium notes day</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {data &&
        data.map((item: any, i: any) => {
          return (
            <Link key={i} href={`${NOTES}/${item._id}`}>
              <div>{item._id}</div>
            </Link>
          );
        })}
    </>
  );
}

export default withLayout(Home);

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = session?.user.userId; // айди авторизованного человека
  const email = session?.user.email;
  const res = await fetch(
    `${process.env.DOMAIN}/api/getAllData?userId=${userId}&email=${email}`
  );
  const data = await res.json();

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      data,
    },
  };
}
