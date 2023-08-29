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
import { get_action, update_action } from "./api/actios";
import Arrow from './arr.svg';
import NewNotesMainMenu from "@/Components/ButtonCreateNewNotes/NewNotesMainMenu";
import cn from 'classnames';
import { format, compareAsc } from 'date-fns'
function Home({ data_editor, data_note_main_menu }: any) {
  const [value, setValue] = useState<string>(data_note_main_menu[0] === undefined ? '' :data_note_main_menu[0].body  );
  const session = useSession();
  const userId = session.data?.user.userId;
  const email = session.data?.user.email;

  const dataNoteBook = {
    userId,
    email,
    body: "",
  };
  const createNotesBook = async () => {
    const response = await fetch("/api/createNoteBookMainMenu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataNoteBook),
    });
  };

  useEffect(() => {
    if (userId && email) {
      createNotesBook();
    }
  }, [userId, email]);

  const updateData = useCallback(
    async (value: any, userId: any, email: any) => {
      try {
        const response = await fetch(
          `/api/updateData?action=${update_action.book_main_menu}`,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      updateData(value, userId, email);
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
        <div className={s.date_bg}>{format(new Date(), 'do MMMM Y')}</div>
          <video className={cn(s.video, s.anim)} autoPlay muted loop  src="/bg.mp4"></video>
        </div>
        <div className={s.wrapp2}>
          <div className={s.link_container}>
          <Link className={s.link_notes} href={`${NOTES}`}>
            <span>ЗАМЕТКИ</span> <Arrow/>
          </Link>
          </div>
          <div className={s.container}>
            <List className={s.link} body={data_editor} />
            <NewNotesMainMenu />
          </div>
        </div>
        <div className={s.notes}>
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
      </div>
    </>
  );
}

export default withLayout(Home);

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = session?.user.userId; // айди авторизованного человека
  const email = session?.user.email;
  const responseEditorData = await fetch(
    `${process.env.DOMAIN}/api/getData?action=${get_action.data_editor}&userId=${userId}&email=${email}`
  );
  
  const responseNoteMainMenuData = await fetch(
    `${process.env.DOMAIN}/api/getData?action=${get_action.data_note_main_menu}&userId=${userId}&email=${email}`
  );
  const data_editor = await responseEditorData.json();
  const data_note_main_menu = await responseNoteMainMenuData.json();
  if (!session) {
    return {
      redirect: {
        destination: `/${SIGNIN}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      data_editor,
      data_note_main_menu,
    },
  };
}
