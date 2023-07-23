import React, { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import s from "./NotesList.module.scss";
import Link from "next/link";
import { useSession } from "next-auth/react";
import cn from "classnames";
import { ILinks } from "./NotesList.props";
import { convertFromRaw, EditorState } from "draft-js";
const NotesList = ({ body, checkTitle }: any) => {

  
  const router = useRouter();
  const selectedId = router.query.index;
  const session = useSession();
  const userId = session.data?.user.userId; 
  const email = session.data?.user.email;
  const [links, setLinks] = useState<any>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingData, setLoadingData] = useState(true); 
  useEffect(()=> {
    setTimeout(() => {
      setLoadingData(false)
    },2000)
  },[])
  
  useEffect(() => {
    async function getTitle() {
      const res = await fetch(
        `/api/getAllData?userId=${userId}&email=${email}`
      );
      const data = await res.json();
      console.log("🚀 ~ file: NotesList.tsx:30 ~ getTitle ~ data:", data)
      setLinks(
        data.map((item: ILinks) => {                    
          return {
            title: item.title,
            _id: item._id,
            date: item.date,
            body:item.body,
          
          };
        })
      );
    }
    getTitle();
    
  }, [checkTitle, session, selectedId]);

  const handleDeleteLink = async (linkId?: any) => {    
    const all_id = links && links.map((obj: { _id: string }) => obj._id);
    await all_id.filter((link: any) => link !== linkId);
    const currentIndex = all_id.findIndex((i: string) => i == selectedId);

    if (linkId) {
      try {
        const res = await fetch(`/api/deleteData?_id=${linkId}&userId=${userId}`);
      } catch (error) {
        alert(error);
      }

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

    setLoadingDelete(true);
    setTimeout(() => {
      setLoadingDelete(false);
    }, 750);
  };


  const DraftJsObjectInText = (body:string) => {
    const contentState = convertFromRaw(JSON.parse(body));
    const editorState = EditorState.createWithContent(contentState);
    const plainText = editorState.getCurrentContent().getPlainText();
    return plainText;
  }

  if (loadingData || loadingDelete) {
    return (
      <>
        {body &&
          body.map((item: ILinks) => {
            
            return (
              <div
                key={item._id}
                className={cn(s.block_link, {
                  [s.active]: selectedId === item._id,
                })}
              >
                <button disabled className={s.delete_btn}></button>
                <Link className={s.link} href={`/mainPage/${item._id}`}>
                  <div className={s.title_link}>
                    {item.title ? item.title : "Без названия"}
                  </div>
                  <p> {DraftJsObjectInText(item.body)} </p>
                </Link>
              </div>
            );
          })}
      </>
    );
  } else {
    return (
      <>
        {links &&
          links.map((item: ILinks) => {
            const contentState = convertFromRaw(JSON.parse(item.body));
            const editorState = EditorState.createWithContent(contentState);
            const plainText = editorState.getCurrentContent().getPlainText();
            
            return (
              <div
                key={item._id}
                className={cn(s.block_link, {
                  [s.active]: selectedId === item._id,
                })}
              >
           
                <button
                  className={s.delete_btn}
                  onClick={() => handleDeleteLink(selectedId)}
                ></button>
                <Link className={s.link} href={`/mainPage/${item._id}`}>
                  <div className={s.title_link}>
                    {item.title ? item.title : "Без названия"}
                  </div>
                  <p className={s.body_link}> {DraftJsObjectInText(item.body)}</p>
                </Link>
           
              </div>
            );
          })}
      </>
    );
  }
};

export default NotesList;
