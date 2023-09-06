import Link from "next/link";
import { ILinks } from "./NotesList.props";
import s from "./NotesList.module.scss";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import cn from "classnames";
import { NOTES } from "../../../pages/api/paths";
import React from "react";
import { EditorState, convertFromRaw } from "draft-js";
import { format } from "date-fns";
import ru from "date-fns/locale/ru";

const List = ({ body, loadingDelete, deleteElement }: any) => {
  
  const router = useRouter();
  const routerRecycle = router.asPath.split("/")[1];
  const selectedId = router.query.index;
  const remove_line_break = (str: string) => {
    return str.replace(/\n/g, "");
  };


  const dateManipulation = (date:string,action:string) => {
    try {
      const dateMillisecond = Date.parse(date);
      const newDate  = format(dateMillisecond, "EEEE, d MMMM yyyy HH:mm ss",{ locale: ru });
      switch(action) {
        case 'short':
        const short = newDate.split(" ").slice(1, 3);
        const day = short[0];
        const month = short[1].slice(0,3)
        return `${day} ${month}.`
        case 'long': 
        return newDate.slice(0, newDate.length - 2);
      }
    } catch(er) {
      console.log(er);
      
    }
   
   
   

  }



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
                className={cn(s.block_link, {
                  [s.active]: selectedId === item._id,
                  [s.mainMenu]: router.asPath === "/",
                  [s.lock]: item.block === true,
                  [s.showBlock]: item.block === true,
                  [s.lockMainMenu]:item.block === true && router.asPath === "/",
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
                    [s.mainMenu]: router.asPath === "/",
                    [s.block_item]: item.block === true,
                  })}
                  href={`/${routerRecycle ? routerRecycle : NOTES}/${item._id}`}
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

                <span title={item.block === true ? '':dateManipulation(item.date,'long')} className={cn(s.date, {
                   [s.block_item]: item.block === true,
                   [s.date_mainMenu]: router.asPath===  '/',
                })}>{dateManipulation(item.date,'short')}</span>
              </div>
            );
          }
        })}
    </>
  );
};

export default List;
