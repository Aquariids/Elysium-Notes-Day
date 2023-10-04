import Link from "next/link";
import { ILinks } from "./NotesList.props";
import s from "./NotesList.module.scss";
import { useRouter } from "next/router";
import { useCallback, useMemo, } from "react";
import cn from "classnames";
import { NOTES } from "../../../pages/api/paths";
import React from "react";
import { EditorState, convertFromRaw } from "draft-js";

const List = ({ body, loadingDelete, deleteElement, idPage = null}: any) => {
  console.log("🚀 ~ file: List.tsx:12 ~ List ~ idPage:", idPage)
  const router = useRouter();
  const hrefBook = `book/${idPage}`;

  const routerRecycle = router.asPath.split("/")[1];
  const selectedId = idPage || idPage === 0 ? router.query.book : router.query.index;
  const remove_line_break = (str: string) => {
    return str.replace(/\n/g, "");
  };

  const DraftJsObjectInText = (body: string) => {
    const contentState = convertFromRaw(JSON.parse(body));
    const editorState = EditorState.createWithContent(contentState);
    const plainText = editorState
      .getCurrentContent()
      .getPlainText()
      .toLowerCase();

    const sizeText = router.asPath === "/" ? 100 : 77;

    if (plainText.length >= sizeText) {
      const text = plainText.slice(0, sizeText) + "...";
      return remove_line_break(text);
    } else {
      return remove_line_break(plainText);
    }
  };

  const sliceTitle = (title: string) => {
    const sizeTitle = router.asPath === "/" ? 10 : 25;
    if (title.length >= sizeTitle) {
      const text = title.slice(0, sizeTitle) + "...";
      return remove_line_break(text);
    } else {
      return remove_line_break(title);
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
                className={cn(s.wrapper_link, {
                  [s.active]: selectedId === item._id,
                  [s.mainMenuLink]: router.asPath === "/",
                  [s.lock]: item.block === true,
                  [s.showBlock]: item.block === true,
                  [s.lockMainMenu]:
                    item.block === true && router.asPath === "/",
                })}
              >
                <div
                  className={cn(s.hide_content_link, {
                    [s.hide_content_link_active]: selectedId === item._id,
                  })}
                ></div>
                <Link
                  rel="preload"
                  className={cn(s.link, {
                    [s.blockLink]: selectedId === item._id,
                    [s.mainMenuLink]: router.asPath === "/",
                    [s.block_item]: item.block === true,
                  })}
                  href={`/${idPage || idPage === 0 && hrefBook || routerRecycle && routerRecycle || NOTES }/${item._id}`}
                >
                  <p
                    className={cn(s.title_link, {
                      [s.boldTitle]: router.asPath === "/",
                    })}
                  >
                    {item.title
                      ? getCachedTextTitle(item.title)
                      : "Без названия"}
                  </p>
                  <p className={s.body_link}> {getCachedText(item.body)}</p>
                </Link>

                <span
                  title={item.block ? '' : item.dateFull}
                  className={cn(s.date, {
                    [s.block_item]: item.block === true,
                    [s.date_mainMenu]: router.asPath === "/",
                  })}
                >
                  {item.dateShort}
                </span>
              </div>
            );
          }
        })}
    </>
  );
};

export default List;
