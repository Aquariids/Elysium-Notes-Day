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
import { sorting } from "../../utils/sorting";
import ModalBooks from "@/Components/CustomEditor/ModalBooks/ModalBooks";
import Book from './book.svg';
import cn from 'classnames';
const notes = ({ data, idpage, userid, email, databook,all_id}: any) => {
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
    if (databook) {
      const matchingItem = databook.find((item:any) => item.idPage == idpage);
      if (matchingItem) {
        return matchingItem.name;
      }
    }
    return 'all'; 
  }, [idpage, databook]);



  // это наш path по сути текущий url = _id человека
  const selectedItem = useMemo(
    // с помощью useMemo уменьшаю кол рендеров
    () =>
      data &&
      data.find((item: { _id: string }) => {
        return item._id === selectedId;
      }),
    [data, selectedId]
  );

  const getData = useCallback(async () => {
    try {
      if (session.status === "authenticated") {
        const idPageForBooks = await fetch(
          `/api/getData?action=${get_action.id_for_books}&userId=${userid}&email=${email}`
        );
        const [idPage] = await idPageForBooks.json();
        if (idPage === "all") {
          const res = await fetch(
            `/api/getData?action=${get_action.data_editor}&userId=${userid}&email=${email}`
          );
          const data = await res.json();
          setLinks(data);
        } else {
          const res2 = await fetch(
            `/api/getData?action=${get_action.data_editorBook}&userId=${userid}&email=${email}&idPage=${idPage}`
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
    updateActiveSortingAction(sort, userid, email);
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
                  data={links ? sorting(links, sort) : ""}
                  body={data ? sorting(data, sort) : ""}
                  userId={userid}
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
            userId = {userid}
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

    const userid = session?.user.userId; // айди авторизованного человека
    const email = session?.user.email;

    const idPageForBooks = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.id_for_books}&userId=${userid}&email=${email}`
    );
    const [idpage] = await idPageForBooks.json();
    const res =
    idpage === "all"
        ? await fetch(
            `${process.env.DOMAIN}/api/getData?action=${get_action.data_editor}&userId=${userid}&email=${email}`
          )
        : await fetch(
            `${process.env.DOMAIN}/api/getData?action=${get_action.data_editorBook}&userId=${userid}&email=${email}&idPage=${idpage}`
          );
    const data = await res.json();
    const resBook = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.id_page_book}&userId=${userid}&email=${email}`
    );
    const databook = await resBook.json();
    let all_id = data && data.map((obj: { _id: string }) => obj._id);

    return {
      props: { data, idpage,userid,email,databook,all_id},
    };
  } catch (err) {
    console.error(err);
  }
}

export default withLayout(notes);
