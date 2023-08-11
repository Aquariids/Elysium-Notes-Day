import { getSession, useSession } from "next-auth/react";
import React, { useState } from "react";
import { withLayout } from "../../layout/Layout";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { useRouter } from "next/router";
import s from "./mainPage.module.scss";
import Error404 from "../Error404";
import NotesList from "@/Components/NotesList/NotesList";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import { NOTES } from "../api/paths";
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
const MainPage = ({ data }: any) => {
  console.log("🚀 ~ file: index.tsx:14 ~ MainPage ~ data:", data)
  const  [checkTitle, setCheckTitle] = useState(false); // ну тупая хуета, да. короче перекидывю шнягу в редактор и лист где все заметки
  // суть такая, что заголовок я меняю в редакторе, это передаю на сервер, потом проверяю checkTitle, если он менялся, значит меняю заголовок и в  NotesList. Вот и все.
  const router = useRouter();
  const selectedId = router.query.index;

  // это наш path по сути текущий url = _id человека
  const selectedItem = data.find(
    (item: { _id: string }) => item._id === selectedId
  ); // ищем в нашем массиве первый _id попавший под услвоие. То есть если он равен id из url

    return (
      // ну и паередаем его в наш редактор.
      <div className={s.wrapper}>
        <div className={s.notes_list}>
        <div className={s.container}>
            <div>
            <h2> Корзина пуста</h2>
          Если в корзине есть заметки, нажмите на «...», чтобы восстановить или удалить их.
            </div>
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

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions)
  const userId = session?.user.userId; // айди авторизованного человека
  const email = session?.user.email;
  const res = await fetch(
    `${process.env.DOMAIN}/api/getAllDataRecycle?userId=${userId}&email=${email}`);
  const data = await res.json();

  if (session && data[0] != undefined) {
    return {
      redirect: {
        destination: `/recycle/${data[0]._id}`,
        permanent: false,
      },
    };
  }  else {
    return {
        props: { data},
      };
  }


 
}

export default withLayout(MainPage);
