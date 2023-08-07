import React, { useCallback, useEffect, useMemo, useState } from "react";
import { withLayout } from "../../layout/Layout";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { useRouter } from "next/router";
import s from "./mainPage.module.scss";
import Error404 from "../Error404";
import NotesList from "@/Components/NotesList/NotesList";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import Link from "next/link";
import { NOTES } from "../api/paths";
import { useSession } from "next-auth/react";
import { ILinks } from "@/Components/NotesList/NotesList.props";
const notes = ({ data }: any) => {
  const  [checkTitle, setCheckTitle] = useState(false); // ну тупая хуета, да. короче перекидывю шнягу в редактор и лист где все заметки
  // суть такая, что заголовок я меняю в редакторе, это передаю на сервер, потом проверяю checkTitle, если он менялся, значит меняю заголовок и в  NotesList. Вот и все.
  const router = useRouter();
  const selectedId = router.query.index;
  const [links, setLinks] = useState<any>();
  const session = useSession();
  const userId = session.data?.user.userId; 
  const email = session.data?.user.email;
  // это наш path по сути текущий url = _id человека
  const selectedItem = useMemo(  // с помощью useMemo уменьшаю кол рендеров
    () => data.find((item: { _id: string }) => {
      return item._id === selectedId}),
    [data, selectedId]
  ); 

  if (!selectedItem) {
    return <Error404 />;
  } else {
    return (
      // ну и паередаем его в наш редактор.
     
      <div className={s.wrapper}>
        <div className={s.notes_list}>
        <div className={s.container}>
     
           {data[0]  && <NotesList recycle={false} checkTitle={checkTitle} body={data} userId={userId} />}
        </div>
        </div>
        <div className={s.editor}>
          
          {selectedItem && (
            <CustomEditor 
              checkTitle = {checkTitle}
              setCheckTitle = {setCheckTitle}
              title={selectedItem.title}
              body={selectedItem.body}
              key={selectedItem._id}
              id={selectedItem._id}
            />
            
          )}
        
        </div>
      </div>
    
    );
  }
};

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions)
  const userId = session?.user.userId; // айди авторизованного человека
  const email = session?.user.email;
  const res = await fetch(
    `${process.env.DOMAIN}/api/getAllDataRecycle?userId=${userId}&email=${email}`);
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
    props: { data},
  };
}

export default withLayout(notes);
