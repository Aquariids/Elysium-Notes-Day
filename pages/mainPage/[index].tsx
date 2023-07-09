import { getSession } from "next-auth/react";
import React, { useContext, useState } from "react";
import { withLayout } from "../../layout/Layout";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { useRouter } from "next/router";
import Link from "next/link";
import { AppContext } from "../../context/app.context";

const MainPage = ({ data }: any) => {  
  console.log("🚀 ~ file: [index].tsx:10 ~ MainPage ~ data:", data)
  const {idPage} = useContext(AppContext);

  return (
    <>
    <CustomEditor id ={idPage}/> 
    </>


  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } 

  return {
    props: {},
  };
}




export default withLayout(MainPage);
