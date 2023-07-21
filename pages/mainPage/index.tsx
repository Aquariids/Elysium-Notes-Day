import { emptyRawContentState } from "contenido";
import { convertFromRaw } from "draft-js";
import { getServerSession } from "next-auth/next";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { withLayout } from "../../layout/Layout";
import { authOptions } from "../api/auth/[...nextauth]";

const MainPage = ({ data }: any) => {
  return (
    <>
   {data && data.map((item:any,i:any)=> {
    return (
      <Link key={i}  href={`mainPage/${item._id}`}> 
        <div>
        {item._id}
        </div>
      </Link>
    )
   })}
    </>
  );
};




export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions)
  const userId = session?.user.userId; // айди авторизованного человека
  const email = session?.user.email;
  const res = await fetch(`${process.env.DOMAIN}/api/getAllData?userId=${userId}&email=${email}`);
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
    props: {
      data
    }
  };

 

}





export default withLayout(MainPage);
