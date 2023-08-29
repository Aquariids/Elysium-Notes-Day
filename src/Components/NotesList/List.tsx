import Link from "next/link";
import { ILinks } from "./NotesList.props";
import s from "./NotesList.module.scss";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import cn from "classnames";
import { NOTES } from "../../../pages/api/paths";
import React from "react";
import { EditorState, convertFromRaw } from "draft-js";
import Lock from "./lock.svg";
import LockOpen from "./lock_open.svg";
import { get_action, update_action } from "../../../pages/api/actios";
import { useSession } from "next-auth/react";

const List = ({ body, loadingDelete, deleteElement }: any) => {
  const [op,setOp] = useState();
  const router = useRouter();
  const routerRecycle = router.asPath.split("/")[1];
  const selectedId = router.query.index;



  async function hideLink(currentLink: any) {
    const linkToToggle = body.find((item:any) => item._id === currentLink);  
    if (linkToToggle) {
      const updatedLink = { ...linkToToggle, block: !linkToToggle.block }; // Инвертируем значение block
      try {
        const updateRes = await fetch(
          `/api/updateData?action=${update_action.block_link}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedLink),
          }
        );
  
        if (updateRes.ok) {
          setOp(updatedLink);
          router.push(currentLink)

        } else {
          console.error("Ошибка при обновлении данных");
        }
      } catch (error) {
        console.error("Ошибка при обновлении данных:", error);
      }
    } else {
      console.error("Ссылка не найдена");
    }
  }

  
  const DraftJsObjectInText = (body: string) => {
    const contentState = convertFromRaw(JSON.parse(body));
    const editorState = EditorState.createWithContent(contentState);
    const plainText = editorState
      .getCurrentContent()
      .getPlainText()
      .toLowerCase();

    const sizeText = router.asPath === "/" ? 140 : 100;
    if (plainText.length >= sizeText) {
      const text = plainText.slice(0, sizeText) + "...";
      return text.replace(/\s+/g, ' ').trim();
    } else {
      return plainText.replace(/\s+/g, ' ').trim();
    }
  };
  const sliceTitle = (title: string) => {
    if (title.length >= 30) {
      const text = title.slice(0, 30) + "...";
      return text
    } else {
      return title
    }
  };

  const bodyTextsCache = useMemo(() => new Map(), []);
  const TitleTextsCache = useMemo(() => new Map(), []);
  const getCachedText = useCallback(
    (body: string) => {
      if (!bodyTextsCache.has(body)) {
        const text = DraftJsObjectInText(body);
        bodyTextsCache.set(body, text);
      }
      return bodyTextsCache.get(body);
    },
    [bodyTextsCache]
  );

  const getCachedTextTitle = useCallback(
    (title: string) => {
      if (!TitleTextsCache.has(title)) {
        const text = sliceTitle(title);
        TitleTextsCache.set(title, text);
      }
      return TitleTextsCache.get(title);
    },
    [TitleTextsCache]
  );

  return (
    <>
      {body &&
        body.map((item: ILinks) => {
          if (loadingDelete && deleteElement === item._id) {
            return <React.Fragment key={item._id}> </React.Fragment>;
          } else {
            return (
              <div
                key={item._id}
                className={cn(s.block_link, {
                  [s.active]: selectedId === item._id,
                  [s.mainMenu]: router.asPath === "/",
                  [s.lock]: item.block === true,
                  [s.showBlock]: item.block === true
                  
                 
                })}
              >
                <div
                  onClick={() => {
                    hideLink(item._id);
                  }}
                  
                  className={cn(s.hide_content_link, {
                    [s.hide_content_link_active]: selectedId === item._id,
                  })}
                >
                  {item.block ? <Lock /> : <LockOpen />}
                </div>
                <Link
                  rel="preload"
                  className={cn(s.link, {
                    [s.blockLink]: selectedId === item._id,
                    [s.mainMenu]: router.asPath === "/",
                    [s.block_item]: item.block === true
                  })}
                  href={`/${routerRecycle ? routerRecycle : NOTES}/${item._id}`}
                >
                  <p className={s.title_link}>
                    {item.title
                      ? getCachedTextTitle(item.title)
                      : "Без названия"}
                  </p>
                  <p className={s.body_link}> {getCachedText(item.body)}</p>
                </Link>
              </div>
            );
          }
        })}
    </>
  );
};

export default List;
