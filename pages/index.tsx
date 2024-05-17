import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { NOTES, SIGNIN } from "./api/paths";
import { withLayout } from "../layout/Layout";
import Link from "next/link";
import s from "./index.module.scss";
import List from "@/Components/NotesList/List";
import TextareaAutosize from "react-textarea-autosize";
import { useSession } from "next-auth/react";
import { create_data_action, update_action } from "./api/actions";
import Arrow from "./arr.svg";
import NewNotesMainMenu from "@/Components/ButtonCreateNewNotes/NewNotesMainMenu";
import cn from "classnames";
import AnimationContainer from "@/Components/AnimationContainer/AnimationContainer";
import { sorting } from "../utils/sorting";
import { DateTime } from "luxon";
import { Settings } from "luxon";

import {
  getActiveNotebook,
  getActiveNotebookWithoutId,
  getAllUserNotes,
  getAllUserNotesWithoutId,
  getMainMenuNote,
  getUserNotesFromNotebook,
} from "./api/auth/lib/Get";
Settings.defaultLocale = "ru";
DateTime.local().setLocale("ru");
function Home({ data_editor, data_note_main_menu, email, user_id }: any) {
  const [value, setValue] = useState<string>(
    data_note_main_menu[0] === undefined ? "" : data_note_main_menu[0].body
  );
  const [currentDate, setCurrentDate] = useState<string>();
  const session = useSession();

  const [sort, setSort] = useState<any>("");
  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userDate = DateTime.now().setZone(userTimeZone);
    const formattedDate = userDate
      .toFormat("EEEE, d MMMM yyyy")
      .toLocaleUpperCase();
    const sort = localStorage.getItem("sorting") || "";
    setSort(sort);
    setCurrentDate(formattedDate + " г.");
  }, []);

  const createNotesBook = async () => {
    const dataNoteBook = {
      userId: user_id,
      email,
      body: "",
    };
    const response = await fetch(
      `/api/createData?action=${create_data_action.initialize_main_menu_note}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataNoteBook),
      }
    );
  };

  
  const createBookForNotes = async () => {
    const dataNoteBook = {
      userId: user_id,
      email,
      book: "all",
    };
    const response = await fetch(
      `/api/createData?action=${create_data_action.initialize_master_notebook}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataNoteBook),
      }
    );
  };

  const createActionSorting = async () => {
    const sortData = {
      userId: user_id,
      email,
      sorting: "",
    };
    const response = await fetch(
      `/api/createData?action=${create_data_action.initialize_sorting_preferences}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sortData),
      }
    );
  };

  useEffect(() => {
    if (user_id && email) {
      createNotesBook();
      createBookForNotes();
      createActionSorting();
    }
  }, [user_id, email]);

  const updateMainMenuNote = useCallback(
    async (value: any, userId: any, email: any) => {
      try {
        const response = await fetch(
          `/api/updateData?action=${update_action.update_main_menu_note}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              email,
              body: value,
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
    []
  );

  // const updateBookForNotes = useCallback(async () => {
  //   try {
  //     const response = await fetch(
  //       `/api/updateData?action=${update_action.update_active_notebook}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           userId: session.data?.user.userId,
  //           email: session.data?.user.email,
  //           book: "all",
  //         }),
  //       }
  //     );
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateMainMenuNote(value, user_id, email);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <>
      <Head>
        <title>Elysium notes day</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={s.wrapper}>
        <div className={s.bg}>
          <div className={s.bg_date}>{currentDate}</div>
          <video
            className={cn(s.video, s.anim)}
            autoPlay
            muted
            loop
            src="/bg.mp4"
          ></video>
        </div>

        <AnimationContainer>
          <div className={s.notes}>
            <div className={s.notes_title}>
              <Link
                // onClick={updateBookForNotes}
                className={s.notes_title_link}
                href={`${NOTES}`}
              >
                <span>ЗАМЕТКИ</span> <Arrow />
              </Link>
            </div>
            <div className={s.container}>
              <List
                className={s.link}
                body={data_editor ? sorting(data_editor, sort) : ""}
              />
              <NewNotesMainMenu userId={user_id} email={email} />
            </div>
          </div>
        </AnimationContainer>
        <AnimationContainer>
          <div className={s.main_menu_note}>
            <p>ЗАПИСНАЯ КНИЖКА</p>
            <TextareaAutosize
              placeholder="Запишите что-нибудь..."
              className={s.textArea}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </div>
        </AnimationContainer>
      </div>
    </>
  );
}

export default withLayout(Home);

export async function getServerSideProps(context: any) {
  try {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );

    if (!session) {
      return {
        redirect: {
          destination: `/${SIGNIN}`,
          permanent: false,
        },
      };
    }

    const user_id: string = session?.user.userId; // айди авторизованного человека
    const email: string = session?.user.email;
    const [idpage,name]: any = await getActiveNotebook(user_id, email);
  
    
    if (user_id && email) {
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


      const responseNoteMainMenuData = await getMainMenuNote(user_id, email);
      const serializedData = responseEditorData?.map((item) => ({
        // "сериализуем" данные, и делаем из objectId у mongodb обычную строку, смотрим, что названиме тоже изменилось
        ...item,
        _id: item._id.toString(),
      }));
      const serializedDataMainMenu = responseNoteMainMenuData?.map((item) => ({
        // "сериализуем" данные, и делаем из objectId у mongodb обычную строку, смотрим, что названиме тоже изменилось
        ...item,
        _id: item._id.toString(),
      }));

      return {
        props: {
          data_editor: serializedData,
          data_note_main_menu: serializedDataMainMenu,
          email,
          user_id,
        },
      };
    }
  } catch {
    return { props: {} };
  }
}
