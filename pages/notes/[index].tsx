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
import Book from './book.svg';
import cn from 'classnames';
import { getAllUserNotes, getActiveNotebook, getAllUserNotebook, getUserNotesFromNotebook  } from "../api/auth/lib/Get";
import { Record } from "immutable";

const notes = ({ data_editor, idpage, user_id, email, data_book, all_id}: notes_data & Record<string, unknown>) => {
console.log("🚀 ~ notes ~ data_editor:", data_editor)

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
  const name = useMemo(() => {
    if (data_book) {
      const matchingItem = data_book.find((item:any) => item.idPage == idpage);
      if (matchingItem) {
        return matchingItem.name;
      }
    }
    return 'all'; 
  }, [idpage, data_book]);



  // это наш path по сути текущий url = _id человека
  const selectedItem = useMemo(
    // с помощью useMemo уменьшаю кол рендеров
    () =>
    data_editor &&
    data_editor.find((item: { _id:string }) => {
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
        if (idPage === "all") {
          const res = await fetch(
            `/api/getData?action=${get_action.get_all_user_notes}&userId=${user_id}&email=${email}`
          );
          const data = await res.json();
          setLinks(data);
        } else {
          const res2 = await fetch(
            `/api/getData?action=${get_action.get_user_notes_from_notebook}&userId=${user_id}&email=${email}&idPage=${idPage}`
          );
          const data2 = await res2.json();
          setLinks(data2);
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
          <p className={cn(s.nameBook)} onClick={() => setActiveModal(true)}>
            <span className={s.tooltip}><Book/> <span>{idpage === 'all' ? "Всe": name && name}</span></span>
          </p>
          
          <ModalBooks
            userId = {user_id}
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

  
    const user_id:string = session?.user.userId; // айди авторизованного человека
    const email:string = session?.user.email;
    const [idpage]:any = await getActiveNotebook(user_id, email);
   
    const responseEditorData =  idpage === 'all' ? await getAllUserNotes(user_id, email): await getUserNotesFromNotebook (user_id, email, idpage); // responseEditorData - Заметки все, то есть все что для редактора
    const dataRes = await getAllUserNotebook(user_id, email)

    const data_book = dataRes?.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));
    const serializedData = responseEditorData?.map((item) => ({ // "сериализуем" данные, и делаем из objectId у mongodb обычную строку, смотрим, что названиме тоже изменилось
      ...item,
      _id: item._id.toString(), 
    }));
    let all_id = serializedData && serializedData.map((obj: { _id: any }) => obj._id);// получаем все _id заметок в одном месте.

    return {
      props: { data_editor: serializedData, idpage, user_id,email,data_book,all_id }, // тут данные для редактора уже просто dataEditor!
    };
  } catch (err) {
    return {props: {}}
  }
}

export default withLayout(notes);
