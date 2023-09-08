import React, { useCallback, useEffect, useMemo, useState } from "react";
import { withLayout } from "../../layout/Layout";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { useRouter } from "next/router";
import s from "./notes.module.scss";
import NotesList from "@/Components/NotesList/NotesList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import HeaderNotes from "@/Components/HeaderNotes/HeaderNotes";
import { NOTES } from "../api/paths";
import { get_action, update_action } from "../api/actios";
import AnimationContainer from "@/Components/AnimationContainer/AnimationContainer";
const notes = ({ data }: any) => {
  const [checkTitle, setCheckTitle] = useState(false); // ну тупая хуета, да. короче перекидывю шнягу в редактор и лист где все заметки
  // суть такая, что заголовок я меняю в редакторе, это передаю на сервер, потом проверяю checkTitle, если он менялся, значит меняю заголовок и в  NotesList. Вот и все.
  const [sort, setSort] = useState<any>();
  
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteElement, setDeleteElement] = useState<any>();
  const router = useRouter();
  const selectedId = router.query.index;
  const [links, setLinks] = useState<any>();
  const session = useSession();
  const userId = session.data?.user.userId;
  const email = session.data?.user.email;
  
  // это наш path по сути текущий url = _id человека
  const selectedItem = useMemo(
    // с помощью useMemo уменьшаю кол рендеров
    () =>
      data.find((item: { _id: string }) => {
        return item._id === selectedId;
      }),
    [data, selectedId]
  );

  function sortBody(body: any) {
    try {
      const sortBody = body.sort((a: any, b: any) => {
        const dateA = Date.parse(a.date);
        const dateB = Date.parse(b.date);
  
        if (sort === "dateUp") return dateB - dateA; // Сравниваем в обратном порядке для сортировки от новых к старым
        if (sort === "dateDown") return dateA - dateB;
        if(sort=== 'no-sorting')  return body;
      });
  
      return sortBody;
    }

    catch (err) {
      console.log(err);
      
    }

  }
 
  const getData = useCallback(async () => {

    try {
      if (session.status === "authenticated") {
        const res = await fetch(
          `/api/getData?action=${get_action.data_editor}&userId=${userId}&email=${email}`
        );
        const data = await res.json();
        setLinks(data);
      }
    } catch(err) {
      alert(err)
      
    }
   
  }, [checkTitle, data]);


  const updateActiveSortingAction= useCallback(
    async (sorting: any, userId: any, email: any) => {
      try {
        const response = await fetch(
          `/api/updateData?action=${update_action.action_sorting}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              email,
              sorting: sorting,
            }),
          }
        );
      } catch (error) {
        console.log(
          "🚀 ~ file: CustomEditor.tsx:66 ~ updateData ~ error:",
          error
        );
      }
    },
    [sort]
  );

  useEffect(() => {
    if (loadingDelete) {
      getData();
    } else {
      const timer = setTimeout(() => {
        getData();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [checkTitle, data, loadingDelete]);

  useEffect(() => {
    const sort = localStorage.getItem("sorting") || "no-sorting";
    setSort(sort);
    updateActiveSortingAction(sort,userId,email);
    
  }, [sort]);

 

  useEffect(() => {
    if (!selectedItem) {
      router.push(`/${NOTES}`);
    }
  }, [router]);

  return (
    <AnimationContainer> 
    <div className={s.wrapper}>
     
      <div className={s.notes_list}>
        <HeaderNotes setSort={setSort} sort={sort} data={data} />
        <div className={s.container}>
       
          <div className={s.list}>
            {data[0] && (
              <NotesList
                deleteElement={deleteElement}
                loadingDelete={loadingDelete}
                checkTitle={checkTitle}
                data={links ? sortBody(links): links}
                body={data ? sortBody(data): data}
                userId={userId}
              />
            )}
          </div>
         
        </div>
      </div>
      
      
      <div className={s.editor}>
        {selectedItem && (
          <CustomEditor
            setDeleteElement={setDeleteElement}
            setLoadingDelete={setLoadingDelete}
            data={data}
            checkTitle={checkTitle}
            setCheckTitle={setCheckTitle}
            title={selectedItem.title}
            body={selectedItem.body}
            key={selectedItem._id}
            id={selectedItem._id}
            hideNotes={selectedItem.block}
          />
        )}
      </div>
     
    </div>
  
    </AnimationContainer> 
  );
};

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
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
    `${process.env.DOMAIN}/api/getData?action=${get_action.data_editor}&userId=${userId}&email=${email}`
  );
  const data = await res.json();

  return {
    props: { data },
  };
}

export default withLayout(notes);
