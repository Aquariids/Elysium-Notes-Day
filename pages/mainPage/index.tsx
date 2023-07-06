import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { emptyRawContentState } from "contenido";
import { convertFromRaw } from "draft-js";
import { getSession, useSession } from "next-auth/react";
import { withLayout } from "../../layout/Layout";

const MainPage = ({ data }: any) => {
  const { data: session, status } = useSession();
  const emptyContentState = convertFromRaw(emptyRawContentState);
  
  
  
  return (
    <>

    </>


  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const userId = session?.user.userId; // айди авторизованного человека

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: `/MainPage/1`,
      permanent: false,
    },
  };

 
}





export default withLayout(MainPage);
