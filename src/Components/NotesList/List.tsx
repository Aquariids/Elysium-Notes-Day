import Link from "next/link";
import { ILinks } from "./NotesList.props";
import s from "./NotesList.module.scss";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, } from "react";
import cn from "classnames";
import { NOTES } from "../../../pages/api/paths";
import React from "react";
import { EditorState, convertFromRaw } from "draft-js";
import { update_action } from "../../../pages/api/actions";
import { useSession } from "next-auth/react";

const List = ({ body, loadingDelete, deleteElement}: any) => {

  const router = useRouter();

  
  const session = useSession()
  const routerRecycle = router.asPath.split("/")[1];
  const selectedId =  router.query.index;
  // const remove_line_break = (str: string) => {
  //   return str.replace(/\n/g, "");
  // };

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


  if(!body) return <></>
  return (
    <>
      {body &&
        body.map((item: ILinks) => {    
          if (loadingDelete && deleteElement === item._id) {
            return <React.Fragment key={item._id}> </React.Fragment>;
          } else {
            return (
              <div
                key={item._id || Math.random()}
                className={cn({
                 
                  [s.active]: selectedId === item._id,
                  [s.mainMenuLink]: router.asPath === "/",
                  [s.wrapper_link]: router.asPath !== "/",
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
                  onClick={() => {
                 if(router.asPath === '/') {
                  updateBookForNotes()
                  
                 }
                  
                }}
                  rel="preload"
                  className={cn(s.link, {
                    [s.blockLink]: selectedId === item._id,
                    [s.mainMenuLink]: router.asPath === "/",
                    [s.block_item]: item.block === true,
                  })}
                  href={`/${ routerRecycle && routerRecycle || NOTES }/${item._id}`}
                >
                  <p
                    className={cn(s.title_link, {
                      [s.boldTitle]: router.asPath === "/",
                    })}
                  >
                    {item.title
                      ? item.title
                      : "Без названия"}
                  </p>
                  {/* <p className={s.body_link}> {getCachedText(item.body)}</p> */}
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
