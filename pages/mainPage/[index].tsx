import { getSession } from "next-auth/react";
import React from "react";
import { withLayout } from "../../layout/Layout";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { useRouter } from "next/router";



const MainPage = ({ data }: any) => {  
  const router = useRouter();
  return (
    <>
    {data && data.map((item: { _id: string | string[] | undefined; }) => {
      return router.query.index === item._id ? <CustomEditor key={item._id} id={item._id} />: '' 
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
