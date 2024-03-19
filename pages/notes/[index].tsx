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
import { get_action, update_action } from "../api/actions";
import AnimationContainer from "@/Components/AnimationContainer/AnimationContainer";
import { sorting } from "../../utils/sorting";
import ModalBooks from "@/Components/CustomEditor/ModalBooks/ModalBooks";
import Book from "./book.svg";
import cn from "classnames";
import {
  getAllUserNotes,
  getActiveNotebook,
  getAllUserNotebook,
  getUserNotesFromNotebook,
  getActiveNotebookWithoutId,
  getAllUserNotesWithoutId,
} from "../api/auth/lib/Get";
import { Record } from "immutable";

const notes = ({
  data_editor,
  idpage,
  user_id,
  email,
  data_nootebook,
  all_id,
  without_id_props
}: notes_data & Record<string, unknown>) => {
 
  const [checkTitle, setCheckTitle] = useState(false); // ну тупа, да. короче перекидывю шнягу в редактор и лист где все заметки
  // суть такая, что заголовок я меняю в редакторе, это передаю на сервер, потом проверяю checkTitle, если он менялся, значит меняю заголовок и в  NotesList. Вот и все.
  const [sort, setSort] = useState<any>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteElement, setDeleteElement] = useState<string>();
  const router = useRouter();
  const selectedId = router.query.index;
  const [links, setLinks] = useState<any>();
 


  const session = useSession();
  const [activeModal, setActiveModal] = useState(false);
 
  const [withoutId, setWithoutId] = useState<boolean>(Boolean(without_id_props));
  
  useEffect(() => {
   getActiveWithoutId()
  }, []);


  const getActiveWithoutId = async () => {
     await fetch(
      `/api/getData?action=${get_action.get_active_notebook_without_id}&userId=${user_id}&email=${email}`
    )
    .then(async (response) => {
      const [withoutId] = await response.json();
      setWithoutId(withoutId);
  })
    

  };



  const name = useMemo(() => {
    if (data_nootebook) {
      const matchingItem = data_nootebook.find(
        (item: any) => item.idPage == idpage
      );
      if (matchingItem) {
        return matchingItem.name;
      }
    }
    return "all";
  }, [idpage, data_nootebook]);

  // это наш path по сути текущий url = _id человека
  const selectedItem = useMemo(
    // с помощью useMemo уменьшаю кол рендеров
    () =>
      data_editor &&
      data_editor.find((item: { _id: string }) => {
        return item._id === selectedId;
      }),
    [data_editor, selectedId]
  );

  const getData = useCallback(async () => {
    try {
      if (session.status === "authenticated") {
        const idPageForBooks = await fetch(
          `/api/getData?action=${get_action.get_active_notebook}&userId=${user_id}&email=${email}`
        );
        const [idPage] = await idPageForBooks.json();
      
        if (idPage === "all" && !withoutId) {
          const res = await fetch(
            `/api/getData?action=${get_action.get_all_user_notes}&userId=${user_id}&email=${email}`
          );
        
          const data = await res.json();
         
          setLinks(data);
        } else if(idPage === "all" && withoutId) {
          const res2 = await fetch(
            `/api/getData?action=${get_action.get_all_user_notes_without_id}&userId=${user_id}&email=${email}`
          );
          const data2 = await res2.json();
          setLinks(data2);
        } 
        if(idPage !== "all") {
          const res = await fetch(
            `/api/getData?action=${get_action.get_user_notes_from_notebook}&userId=${user_id}&email=${email}&idPage=${idPage}`
          );
          const data = await res.json();
          setLinks(data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [checkTitle, data_editor]);

  const updateActiveSortingAction = useCallback(
    async (sorting: string, userId: string, email: string) => {
      try {
        const response = await fetch(
          `/api/updateData?action=${update_action.update_sorting_preferences}`,
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

  const handleCheckboxChange = () => {
    const newCheckedState = !withoutId;
    setWithoutId(newCheckedState);

    fetch( `/api/updateData?action=${update_action.update_active_notebook_without_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userId:user_id,email, withoutId: newCheckedState }),
    });

    router.push(router.asPath)
  };

  

  useEffect(() => {
    if (loadingDelete) {
      getData();
    } else {
      const timer = setTimeout(() => {
        getData();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [checkTitle, data_editor, loadingDelete]);

  useEffect(() => {
    const sort = localStorage.getItem("sorting") || "no-sorting";
    setSort(sort);
    updateActiveSortingAction(sort, user_id, email);
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
          <HeaderNotes setSort={setSort} sort={sort} data={data_editor} />
          <div className={s.container}>
            <div className={s.list}>
              {data_editor[0] && (
                <NotesList
                  deleteElement={deleteElement}
                  loadingDelete={loadingDelete}
                  checkTitle={checkTitle}
                  data={links ? sorting(links, sort) : ""}
                  body={data_editor ? sorting(data_editor, sort) : ""}
                  userId={user_id}
                />
              )}
            </div>
          </div>
        </div>

        <div className={s.editor}>
          <p className={cn(s.nameBook)}>
            <span onClick={() => setActiveModal(true)} className={s.tooltip}>
              <Book /> <span>{idpage === "all" ? "Всe" : name && name}</span>
            </span>
            {idpage === "all" && (
              <input
                title="Показать заметки без блокнотов"
                style={{ marginLeft: "5px" }}
                type="checkbox"
                checked={withoutId}
                onChange={handleCheckboxChange}
              />
            )}
          </p>

          <ModalBooks
            userId={user_id}
            email={email}
            session={session}
            active={activeModal}
            setActive={setActiveModal}
          />
          {selectedItem && (
            <CustomEditor
              setDeleteElement={setDeleteElement}
              setLoadingDelete={setLoadingDelete}
              setCheckTitle={setCheckTitle}
              key={selectedItem._id}
              selectedItem={selectedItem}
              all_id={all_id}
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

    const user_id: string = session?.user.userId;
    const email: string = session?.user.email;
    const [idpage]: any = await getActiveNotebook(user_id, email);
    const [withoutId]: any = await getActiveNotebookWithoutId(user_id, email);

    let responseEditorData;
    if (idpage === "all" && !withoutId) {
      responseEditorData = await getAllUserNotes(user_id, email, withoutId);
    } else if(withoutId) {
      responseEditorData = await getAllUserNotesWithoutId(user_id, email);
    }
     if(idpage !== "all") {
      responseEditorData = await getUserNotesFromNotebook(user_id, email, idpage);
    }

    const dataRes = await getAllUserNotebook(user_id, email);
    const data_nootebook = dataRes?.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    const serializedData = responseEditorData?.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    let all_id = serializedData?.map((obj: { _id: any }) => obj._id);

    return {
      props: {
        data_editor: serializedData,
        idpage,
        user_id,
        email,
        data_nootebook,
        all_id,
        without_id_props:withoutId ? 1:0 
      },
    };
  } catch (err) {
    return { props: {} };
  }
}

export default withLayout(notes);
