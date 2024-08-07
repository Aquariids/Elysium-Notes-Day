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
import NoteContainer from "@/Components/NoteContainer/NoteContainer";
import NoteMobileContainer from "@/Components/NoteMobileContainer/NoteMobileContainer";
import { useActiveNotebook } from "../../hooks/useActiveNotebook";
import { useWithoutId } from "../../hooks/useWithoutId";

const notes = ({
  data_editor,
  user_id,
  email,
  data_nootebook,
  all_id,
  without_id_props,
}: notes_data & Record<string, unknown>) => {
  const [checkTitle, setCheckTitle] = useState(false); // ну тупа, да. короче перекидывю шнягу в редактор и лист где все заметки
  // суть такая, что заголовок я меняю в редакторе, это передаю на сервер, потом проверяю checkTitle, если он менялся, значит меняю заголовок и в  NotesList. Вот и все.
  const [sort, setSort] = useState<any>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteElement, setDeleteElement] = useState<string>();
  const router = useRouter();
  const selectedId = router.query.index;
  const [showMobileNotesList, setShowMobileNotesList] = useState(false);
  const { idPage, setIdPage } = useActiveNotebook(user_id, email);
  const { mutateWithoutId } = useWithoutId(user_id, email);

  const session = useSession();
  const [activeModal, setActiveModal] = useState(false);

  const [withoutId, setWithoutId] = useState<boolean>(
    Boolean(without_id_props)
  );

  useEffect(() => {
    mutateWithoutId();
    setShowMobileNotesList(false);
  }, [router]);
  useEffect(() => {
    getActiveWithoutId();
  }, []);

  const getActiveWithoutId = async () => {
    await fetch(
      `/api/getData?action=${get_action.get_active_notebook_without_id}&userId=${user_id}&email=${email}`
    ).then(async (response) => {
      const [withoutId] = await response.json();
      setWithoutId(withoutId);
    });
  };

  const name = useMemo(() => {
    if (data_nootebook) {
      const matchingItem = data_nootebook.find(
        (item: any) => item.idPage == idPage
      );
      if (matchingItem) {
        return matchingItem.name;
      }
    }
    return "all";
  }, [idPage, data_nootebook]);

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

  const handleCheckboxChange = () => {
    const newCheckedState = !withoutId;
    setWithoutId(newCheckedState);
    mutateWithoutId();

    fetch(
      `/api/updateData?action=${update_action.update_active_notebook_without_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user_id,
          email,
          withoutId: newCheckedState,
        }),
      }
    );
  };

  useEffect(() => {
    const sort = localStorage.getItem("sorting") || "no-sorting";
    setSort(sort);
  }, [sort]);

  useEffect(() => {
    if (!selectedItem) {
      router.push(`/${NOTES}`);
    }
  }, [router]);

  return (
    <AnimationContainer>
      <div className={s.wrapper}>
        <div className={s.desktop}>
          <NoteContainer
            NotesList={NotesList}
            email={email}
            without_id={withoutId}
            idPage={idPage}
            loadingDelete={loadingDelete}
            deleteElement={deleteElement}
            checkTitle={checkTitle}
            sort={sort}
            sorting={sorting}
            user_id={user_id}
            setSort={setSort}
            HeaderNotes={HeaderNotes}
          />
        </div>

        <div className={s.mobile}>
          <NoteMobileContainer
            showMobileNotesList={showMobileNotesList}
            NotesList={NotesList}
            idPage={idPage}
            loadingDelete={loadingDelete}
            deleteElement={deleteElement}
            checkTitle={checkTitle}
            links={[]}
            sort={sort}
            sorting={sorting}
            user_id={user_id}
            setSort={setSort}
            HeaderNotes={HeaderNotes}
            
            BookSvg={Book}
            withoutId={withoutId}
            name={name}
            handleCheckboxChange={handleCheckboxChange}
            setActiveModal={setActiveModal}
          />
        </div>

        <div className={s.editor}>
          <p className={cn(s.nameBook)}>
            <span onClick={() => setActiveModal(true)} className={s.tooltip}>
              <Book /> <span>{idPage === "all" ? "Всe" : name && name}</span>
            </span>
            {idPage === "all" && (
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
            setIdPage={setIdPage}
            idPage={idPage}
            userId={user_id}
            email={email}
            session={session}
            active={activeModal}
            setActive={setActiveModal}
          />
          {selectedItem && (
            <CustomEditor
              showMobileNotesList={showMobileNotesList}
              setDeleteElement={setDeleteElement}
              setLoadingDelete={setLoadingDelete}
              setCheckTitle={setCheckTitle}
              key={selectedItem._id}
              selectedItem={selectedItem}
              all_id={all_id}
            />
          )}
        </div>
        <button
          onClick={() => setShowMobileNotesList(!showMobileNotesList)}
          className={s.mobile_btn}
        >
          {" "}
          Меню{" "}
        </button>
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
    } else if (withoutId) {
      responseEditorData = await getAllUserNotesWithoutId(user_id, email);
    }
    if (idpage !== "all") {
      responseEditorData = await getUserNotesFromNotebook(
        user_id,
        email,
        idpage
      );
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
        without_id_props: withoutId ? 1 : 0,
      },
    };
  } catch (err) {
    return { props: {} };
  }
}

export default withLayout(notes);
