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
import { create_data, get_action, update_action } from "./api/actios";
import Arrow from "./arr.svg";
import NewNotesMainMenu from "@/Components/ButtonCreateNewNotes/NewNotesMainMenu";
import cn from "classnames";
import AnimationContainer from "@/Components/AnimationContainer/AnimationContainer";
import { sorting } from "../utils/sorting";
import { DateTime } from "luxon";
import { Settings } from "luxon";
Settings.defaultLocale = "ru";
DateTime.local().setLocale("ru");
function Home({ data_editor, data_note_main_menu }: any) {
  const [value, setValue] = useState<string>(
    data_note_main_menu[0] === undefined ? "" : data_note_main_menu[0].body
  );
  const [currentDate, setCurrentDate] = useState<string>();
  const session = useSession();
  const userId = session.data?.user.userId;
  const email = session.data?.user.email;
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

  const monika = `Цвета, они не
Яркие, пре ра ные цв т
М рцают, вз ыва тся, пр нз ют
Красный, зеленый, синий
Бес онечная

КАКОФОНИЯ
Бессмысленного
шума

Шум, он не ПРЕКРАЩАЕТСЯ.

Безу ные, грох чу ие во ны
Пи ат, в зжат, пр нза ют

СИНУС, КОСИНУС, ТАНГЕНС

Как игр ть с пл сти кой на д дже ве туш е.

Как играть с НОЖОМ на ДЫЩАЩЕЙ ГРУДИ.

ес он чн й
с и

Б с мы ли ы
Удали её
  `;
  const createNotesBook = async () => {
    const dataNoteBook = {
      userId,
      email,
      body: monika,
    };
    const response = await fetch(
      `/api/createData?action=${create_data.create_data_main_menu}`,
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
      userId,
      email,
      book: 'all',
    };
    const response = await fetch(
      `/api/createData?action=${create_data.create_book_for_notes}`,
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
      userId,
      email,
      sorting: "",
    };
    const response = await fetch(
      `/api/createData?action=${create_data.create_data_sorting}`,
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
    if (userId && email) {
      createNotesBook();
      createBookForNotes();
      createActionSorting();
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
          <div className={s.date_bg}>{currentDate}</div>
          <video
            className={cn(s.video, s.anim)}
            autoPlay
            muted
            loop
            src="/bg.mp4"
          ></video>
        </div>

        <AnimationContainer>
          <div className={s.wrapp2}>
            <div className={s.link_container}>
              <Link className={s.link_notes} href={`${NOTES}`}>
                <span>ЗАМЕТКИ</span> <Arrow />
              </Link>
            </div>
            <div className={s.container}>
              <List
                className={s.link}
                body={data_editor ? sorting(data_editor, sort) : ""}
              />
              <NewNotesMainMenu />
            </div>
          </div>
        </AnimationContainer>
        <AnimationContainer>
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
        </AnimationContainer>
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
