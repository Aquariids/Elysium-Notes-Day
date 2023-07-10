import { getSession } from "next-auth/react";
import React, { useContext, useState } from "react";
import { withLayout } from "../../layout/Layout";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { useRouter } from "next/router";
import Link from "next/link";
import { AppContext } from "../../context/app.context";

const MainPage = ({ data }: any) => {  
  const router = useRouter();
  console.log("🚀 ~ file: [index].tsx:11 ~ MainPage ~ router:", router.query.index)
  return (
    <>
    {data && data.map(item => {
      return router.query.index === item._id ? <CustomEditor id={item._id} />: '' 
    })}
    </>


  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const userId = session?.user.userId; // айди авторизованного человека
  const email = session?.user.email;
  const res = await fetch(`${process.env.DOMAIN}/api/getAllData?userId=${userId}&email=${email}`); // тут наверное лучше сразу сделатьт запрос к нужному документу, а не все грузить
  const data = await res.json();

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } 

  return {
    props: {data},
  };
}




export default withLayout(MainPage);
