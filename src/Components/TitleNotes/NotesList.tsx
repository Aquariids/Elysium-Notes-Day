import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import s from "./NotesList.module.scss";
import Link from "next/link";
import { useSession } from "next-auth/react";
import cn from "classnames";
import { ILinks, INotesList } from "./NotesList.props";
import { convertFromRaw, EditorState } from "draft-js";
import { NOTES } from "../../../pages/api/paths";
import HeaderNotes from "../HeaderNotes/HeaderNotes";
const NotesList = ({data, body, userId, recycle }: any) => {
  const router = useRouter();
  const selectedId = router.query.index;
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingData, setLoadingData] = useState(true); 
  const [counterNotes, setCounterNotes] = useState(body.length);
  

  useEffect(()=> {
    setCounterNotes(body.length)
  },[router])
  
  useEffect(()=> {
    setTimeout(() => {
      setLoadingData(false)
    },2000)
  },[])
 

  


  const handleDeleteLink = async (linkId?: string | string[]) => {    
    const all_id = data && data.map((obj: { _id: string }) => obj._id);
    await all_id.filter((link: any) => link !== linkId);
    const currentIndex = all_id.findIndex((i: string) => i == selectedId);

    const res = await fetch(`/api/deleteData?_id=${linkId}&userId=${userId}`);
   
   
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
        router.push("/notes");
      } else {
        alert("ЧЕ ТО ТЫ НЕ ТО ДЕЛАЕШЬ");
      }
    

    setLoadingDelete(true);
    setTimeout(() => {
      setLoadingDelete(false);
    }, 750);
  };


  const DraftJsObjectInText = (body:string) => {
    const contentState = convertFromRaw(JSON.parse(body));
    const editorState = EditorState.createWithContent(contentState);
    const plainText = editorState.getCurrentContent().getPlainText().toLowerCase()
    
    if(plainText.length >= 130) {
      const text = plainText.slice(0, 130) + '...'
      return text;
    } else {
      return plainText
    }
    
  }
  const sliceTitle = (title:string) => {
    if(title.length >= 30) {
      const text = title.slice(0, 30) + '...';
      return text;
    } else {
      return title
    }
    
  }
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

  
   if(loadingData || loadingDelete && !recycle) {
    return (
      <>
         <HeaderNotes length={counterNotes}/> 
        {body &&
          body.map((item: ILinks, i:number) => {
            return (
              <div
                key={item._id}
                className={cn(s.block_link, {
                  [s.first_block_link]: i === 0,
                  [s.active]: selectedId === item._id,
                })}
              >
                <button
                 className={cn(s.delete_btn, {
                  [s.show]: selectedId === item._id,
                })}
                  onClick={() => handleDeleteLink(selectedId)}
                >x</button>
                {loadingDelete ? "пидар" :<Link rel="preload" className = {
                  cn(s.link, {
                    [s.blockLink]: selectedId === item._id,
                  })
                }  href={`/${NOTES}/${item._id}`}>
                  <p className={s.title_link}>
                    {item.title ? getCachedTextTitle(item.title) : "Без названия"}
                  </p>
                  <p className={s.body_link}> {getCachedText(item.body)}</p>
                </Link>}
           
              </div>
            );
          })}
          
      </>
    );
   } else  {
    return (
      <>
         <HeaderNotes length={counterNotes}/> 
        {data &&
          data.map((item: ILinks, i:number) => {
            return (
              <div
                key={item._id}
                className={cn(s.block_link, {
                  [s.first_block_link]: i === 0,
                  [s.active]: selectedId === item._id,
                  
                  
                })}
              >
                <button
                 className={cn(s.delete_btn, {
                  [s.show]: selectedId === item._id,
                })}
                  onClick={() => handleDeleteLink(selectedId)}
                >x</button>
                <Link rel="preload" className = {
                  cn(s.link, {
                    [s.blockLink]: selectedId === item._id,
                  })
                }  href={`/${NOTES}/${item._id}`}>
                  <p className={s.title_link}>
                    {item.title ? getCachedTextTitle(item.title) : "Без названия"}
                  </p>
                  <p className={s.body_link}> {getCachedText(item.body)}</p>
                </Link>
           
              </div>
            );
          })}
          
      </>
    );
   }
  }


export default NotesList;
