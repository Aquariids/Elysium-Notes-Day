import React, { useCallback, useEffect, useMemo, useState } from "react";
import { withLayout } from "../../layout/Layout";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { useRouter } from "next/router";
import s from "./notes.module.scss";
import Error404 from "../Error404";
import NotesList from "@/Components/NotesList/NotesList";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import HeaderNotes from "@/Components/HeaderNotes/HeaderNotes";
const notes = ({ data }: any) => {
  const  [checkTitle, setCheckTitle] = useState(false); // ну тупая хуета, да. короче перекидывю шнягу в редактор и лист где все заметки
  // суть такая, что заголовок я меняю в редакторе, это передаю на сервер, потом проверяю checkTitle, если он менялся, значит меняю заголовок и в  NotesList. Вот и все.

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteElement, setDeleteElement] = useState<any>();
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
  
  // console.log([...data].sort((a, b) => a.title.localeCompare(b.title)))
  // console.log(links);
  const  sortA = links && [...links].sort((a, b) => a.title.localeCompare(b.title)); // сортировка по алфавиту
  const getData = useCallback(async () => {
    if(session.status === 'authenticated') {
      const res = await fetch(
        `/api/getAllData?userId=${userId}&email=${email}`);
        const data = await res.json();
        setLinks(data);
    }

  }, [checkTitle, data]);
  
  useEffect(() => {
    if(loadingDelete) {
      getData()
    } else {
      const timer = setTimeout(() => {
        getData()
      }, 300);
  
      return () => clearTimeout(timer);
    }
   
  }, [checkTitle,data,loadingDelete]);

  useEffect(()=> {
    if(!selectedItem) {
      router.push('/notes')
    }
  },[router])

  
    return (
      // ну и паередаем его в наш редактор.
      <div className={s.wrapper}>
        <div className={s.notes_list}>
        <HeaderNotes data={data}/> 
        <div className={s.container}>
          <div className={s.list}>
           {data[0] && <NotesList deleteElement={deleteElement} loadingDelete={loadingDelete} checkTitle={checkTitle} data={links} body={data} userId={userId} />}
           </div>
        </div>
        </div>
        <div className={s.editor}>
          
          {selectedItem && (
            <CustomEditor 
            setDeleteElement={setDeleteElement}
            setLoadingDelete={setLoadingDelete}
              data={data}
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
  };


export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }   

  const userId = session?.user.userId; // айди авторизованного человека
  const email = session?.user.email;
  const res = await fetch(
    `${process.env.DOMAIN}/api/getAllData?userId=${userId}&email=${email}`);
  const data = await res.json();

  
  return {
    props: { data},
  };
}

export default withLayout(notes);
