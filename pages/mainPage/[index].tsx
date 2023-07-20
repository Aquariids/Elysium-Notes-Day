import { getSession } from "next-auth/react";
import React, { useState } from "react";
import { withLayout } from "../../layout/Layout";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { useRouter } from "next/router";
import s from "./mainPage.module.scss";
import Error404 from "../Error404";
import NotesList from "@/Components/TitleNotes/NotesList";

const MainPage = ({ data }: any) => {
  const  [checkTitle, setCheckTitle] = useState(false); // ну тупая хуета, да. короче перекидывю шнягу в редактор и лист где все заметки
  // суть такая, что заголовок я меняю в редакторе, это передаю на сервер, потом проверяю checkTitle, если он менялся, значит меняю заголовок и в  NotesList. Вот и все.

  const router = useRouter();
  const selectedId = router.query.index;

  // это наш path по сути текущий url = _id человека
  const selectedItem = data.find(
    (item: { _id: string }) => item._id === selectedId
  ); // ищем в нашем массиве первый _id попавший под услвоие. То есть если он равен id из url
  console.log("🚀 ~ file: [index].tsx:21 ~ MainPage ~ selectedItem:", selectedItem)

  if (!selectedItem) {
    return <Error404 />;
  } else {
    return (
      // ну и паередаем его в наш редактор.
     
      <div className={s.wrapper}>
        <div className={s.container}>
           <NotesList checkTitle={checkTitle}  id={selectedItem._id} title={selectedItem.title} data={data} />
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
              date = {selectedItem?.updateDate}
            />
            
          )}
        
        </div>
      </div>
    
    );
  }
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const userId = session?.user.userId; // айди авторизованного человека
  const email = session?.user.email;
  const res = await fetch(
    `${process.env.DOMAIN}/api/getAllData?userId=${userId}&email=${email}`
  );
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
    props: { data, revalidate: 5 },
  };
}

export default withLayout(MainPage);
