import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { emptyRawContentState } from "contenido";
import { convertFromRaw } from "draft-js";
import { getSession, useSession } from "next-auth/react";
import { withLayout } from "../../layout/Layout";

const MainPage = ({ data }: any) => {
  console.log("🚀 ~ file: index.tsx:9 ~ MainPage ~ data:", data)
  const { data: session, status } = useSession();
  const emptyContentState = convertFromRaw(emptyRawContentState);
  
  
  
  return (
    <>
    Короче надо тут получать нужные данные и потом их кидать в контекст и получать уже в нужных компонентах. Типа документы из коллекции. тела их айдишники и тп тд.
    тут можно будет замапить все документы какие есть у пользователя.
    при переходе по ссылке уже переходить на конкретный то есть [index]
    </>


  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
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
    // redirect: {
    //   destination: `/MainPage/1`,
    //   permanent: false,
    // },

    props: {
      data
    }
  };

 

}





export default withLayout(MainPage);
