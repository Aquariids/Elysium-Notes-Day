import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import s from "./NotesList.module.scss";
import Link from "next/link";
import { useSession } from "next-auth/react";
import cn from "classnames";
import { ILinks } from "./NotesList.props";
const NotesList = ({ data, id, checkTitle }: any) => {
  const router = useRouter();
  const selectedId = router.query.index;
  const all_id = data.map((obj: { _id: string }) => obj._id);
  const all_title1 = data.map((obj: { title: string }) => obj.title);
  const session = useSession();
  const userId = session.data?.user.userId; // айди авторизованного человека
  const email = session.data?.user.email;
  const [links, setLinks] = useState<any>();

  useEffect(() => {
    async function getTitle() {
      const res = await fetch(
        `/api/getAllData?userId=${userId}&email=${email}`
      );
      const data = await res.json();
      // const all_title = data.map((item ) => {
      //   console.log(item);
      // })
      setLinks(
        data.map((item:ILinks) => {
          return {
            title: item.title,
            _id: item._id,
            date: item.date
          };
        })
      );

      // .find((item: any) => item._id === id);

      // const test = allTitles.filter((item: any) => item._id !== id);
      //  const test2 = Object.assign(test,{newTitle})
      // console.log(Object.assign(allTitles, {title:"1"}));

      //  setTitle(all_title)
      //  router.push(`/mainPage/${selectedId}`)
      //  const titleId =  newTitle.title
      //  setTitle(newTitle)

      //  await titleId.filter((title: any) => id !== title);
    }

    getTitle();
    updateCurrentLink();
  }, [checkTitle, session, id]);

  async function updateCurrentLink() {
    try {
      const response = await fetch(`/api/updateTitle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(links),
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: CustomEditor.tsx:66 ~ updateData ~ error:",
        error
      );
    }
  }



  const handleDeleteLink = async (linkId: any) => {
    await all_id.filter((link: any) => link !== linkId);
    const currentIndex = all_id.findIndex((i: string) => i == selectedId);
    const res = await fetch(`/api/deleteData?_id=${linkId}`);
    if (res.ok) {
      if (all_id.length >= 2) {
        if (linkId != selectedId) {
          router.push(all_id[currentIndex]);
        } else if (
          linkId === selectedId &&
          all_id[currentIndex + 1] === undefined
        ) {
          router.push(all_id[currentIndex - 1]);
        } else {
          router.push(all_id[currentIndex + 1]);
        }
      } else if (all_id.length === 1) {
        router.push("/mainPage");
      } else {
        alert("ЧЕ ТО ТЫ НЕ ТО ДЕЛАЕШЬ");
      }
    }
  };

  return (
    <>
      {links &&
        links.map((item: ILinks) => {
          return (
            <div key={item._id}
              className={cn(s.block_link, {
                [s.active]: selectedId === item._id,
              })}
            >
              <button
                className={s.delete_btn}
                onClick={() => handleDeleteLink(selectedId)}
              ></button>
              <Link className={s.link} href={`/mainPage/${item._id}`}>
                <p className={s.title_link}>
                  {item.title ? item.title : "Без названия"}
                </p>
                <div>{item.date}</div>
              </Link>
            </div>
          );
        })}
    </>
  );
};

export default NotesList;
