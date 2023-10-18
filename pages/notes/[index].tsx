import React, { use, useCallback, useEffect, useMemo, useState } from "react";
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
import { sorting } from "../../utils/sorting";
import ModalBooks from "@/Components/CustomEditor/ModalBooks/ModalBooks";
const notes = ({ data, databook }: any) => {
  const [checkTitle, setCheckTitle] = useState(false); // ну тупая хуета, да. короче перекидывю шнягу в редактор и лист где все заметки
  // суть такая, что заголовок я меняю в редакторе, это передаю на сервер, потом проверяю checkTitle, если он менялся, значит меняю заголовок и в  NotesList. Вот и все.
  const [sort, setSort] = useState<any>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteElement, setDeleteElement] = useState<string>();
  const [updateBooks, setUpdateBooks] = useState();
  const router = useRouter();
  const selectedId = router.query.index;
  const [links, setLinks] = useState<any>();
  const session = useSession();
  const userId = session.data?.user.userId;
  const email = session.data?.user.email;
  const [activeModal, setActiveModal] = useState(false);
  // это наш path по сути текущий url = _id человека
  const selectedItem = useMemo(
    // с помощью useMemo уменьшаю кол рендеров
    () =>
    data && data.find((item: { _id: string }) => {
        return item._id === selectedId;
      }),
    [data, selectedId]
  );

  const getData = useCallback(async () => {
    try {
      if (session.status === "authenticated") {
        const idPageForBooks = await fetch(
          `/api/getData?action=${get_action.id_for_books}&userId=${userId}&email=${email}`
        );
        const answ = await idPageForBooks.json();
        
        if(answ === 'all' ) {
          const res = await fetch(
            `/api/getData?action=${get_action.data_editor}&userId=${userId}&email=${email}`
          );
          const data = await res.json(); 
          setLinks(data);
        } else {
          const res2 = await fetch(
            `/api/getData?action=${get_action.data_editorBook}&userId=${userId}&email=${email}&idPage=${answ}`
          );
          const data2 = await res2.json();
          setLinks(data2);
        }
         
          
      }
    } catch (err) {
      console.error(err);
    }
  }, [checkTitle, data]);

  const updateActiveSortingAction = useCallback(
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
      } catch (err) {
        console.error(err);
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
    updateActiveSortingAction(sort, userId, email);
  }, [sort]);

  useEffect(() => {
    if (!selectedItem) {
      router.push(`/${NOTES}`);
    }
  }, [router]);

  return (
    <AnimationContainer>
      <div className={s.wrapper}>
        <div>
          <HeaderNotes setSort={setSort} sort={sort} data={data} />
          <div className={s.container}>
            <div className={s.list}>
              {data[0] && (
                <NotesList
                  deleteElement={deleteElement}
                  loadingDelete={loadingDelete}
                  checkTitle={checkTitle}
                  data={links ? sorting(links, sort) : ""}
                  body={data ? sorting(data, sort) : ""}
                  userId={userId}
                />
              )}
            </div>
          </div>
        </div>

        <div className={s.editor}>
          <p onClick={() => setActiveModal(true)}>Привет</p>
          <ModalBooks
            
            setUpdateBooks={setUpdateBooks}
            active={activeModal}
            setActive={setActiveModal}
          />
          {selectedItem && (
            <CustomEditor
              setDeleteElement={setDeleteElement}
              setLoadingDelete={setLoadingDelete}
              data={data}
              checkTitle={checkTitle}
              setCheckTitle={setCheckTitle}
              key={selectedItem._id}
              selectedItem={selectedItem}
              books={databook}
              updateBooks = {updateBooks}
            />
          )}
        </div>
      </div>
    </AnimationContainer>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  try {
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
   
    const idPageForBooks = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.id_for_books}&userId=${userId}&email=${email}`
    );
    const answ = await idPageForBooks.json();
    const res = answ === 'all' ? await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.data_editor}&userId=${userId}&email=${email}`
    ): await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.data_editorBook}&userId=${userId}&email=${email}&idPage=${answ}`
    );
    const data = await res.json();
    const resBook = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.id_page_book}&userId=${userId}&email=${email}`
    );
    const databook = await resBook.json();


  
      return {
        props: { data, databook },
      };
    
   
    
  } catch (err) {
    console.error(err);
  }
}

export default withLayout(notes);
