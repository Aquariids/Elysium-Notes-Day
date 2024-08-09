import Link from "next/link";
import { ILinks } from "./NotesList.props";
import s from "./NotesList.module.scss";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import cn from "classnames";
import { NOTES } from "../../../pages/api/paths";
import React from "react";
import { EditorState, convertFromRaw } from "draft-js";
import { update_action } from "../../../pages/api/actions";
import { useSession } from "next-auth/react";
import List from "./List";

const ListLine = ({
  idPage = null,
  _id,
  dateShort,
  dateFull,
  block,
  title
  
}: any) => {
    const router = useRouter();
    const hrefBook = `book/${idPage}`;
    const session = useSession()
    const routerRecycle = router.asPath.split("/")[1];
    const selectedId = idPage || idPage == 0 ? router.query.book : router.query.index;
  
    const updateBookForNotes = useCallback(async () => {
        try {
          const response = await fetch(
            `/api/updateData?action=${update_action.update_active_notebook}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId:session.data?.user.userId,
                email:session.data?.user.email,
                book: 'all',
              }),
            }
          );
    
          
        } catch (err) {
          console.error(err);
        }
      }, []);

    return (
        <div
        key={_id || Math.random()}
        className={cn({
         
          [s.active]: selectedId === _id,
          [s.mainMenuLink]: router.asPath === "/",
          [s.wrapper_link]: router.asPath !== "/",
          [s.lock]: block === true,
          [s.showBlock]: block === true,
          [s.lockMainMenu]:
            block === true && router.asPath === "/",
        })}
      >
        <div
          className={cn(s.hide_content_link, {
            [s.hide_content_link_active]: selectedId === _id,
          })}
        ></div>
        <Link
          onClick={() => {
         if(router.asPath === '/') {
          updateBookForNotes()
          
         }
          
        }}
          rel="preload"
          className={cn(s.link, {
            [s.blockLink]: selectedId === _id,
            [s.mainMenuLink]: router.asPath === "/",
            [s.block_item]: block === true,
          })}
          href={`/${(idPage || idPage == 0) && hrefBook || routerRecycle && routerRecycle || NOTES }/${_id}`}
        >
          <p
            className={cn(s.title_link, {
              [s.boldTitle]: router.asPath === "/",
            })}
          >
            {title
              ? title
              : "Без названия"}
          </p>
          {/* <p className={s.body_link}> {getCachedText(body)}</p> */}
        </Link>

        <span
          title={block ? '' : dateFull}
          className={cn(s.date, {
            [s.block_item]: block === true,
            [s.date_mainMenu]: router.asPath === "/",
          })}
        >
          {dateShort}
        </span>
      </div>
);

  
};

export default ListLine;
