import Link from "next/link";
import HeaderNotes from "../HeaderNotes/HeaderNotes";
import { DraftJsObjectInText, ILinks, sliceTitle } from "./NotesList.props";
import s from './NotesList.module.scss';
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import cn from 'classnames';
import { NOTES } from "../../../pages/api/paths";
const List = ({body,userId,counterNotes}:any) => {
const router = useRouter();
const selectedId = router.query.index;
const [loadingDelete, setLoadingDelete] = useState(false);
const [deleleElement, setDeleleElement] = useState<any>();
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
    const handleDeleteLink = async (linkId?: string | string[]) => {  
        setDeleleElement(linkId)
        const res = await fetch(`/api/deleteData?_id=${linkId}&userId=${userId}`);
        let all_id = body && body.map((obj: { _id: string }) => obj._id);
        await all_id.filter((link:string) => link !== linkId);
        const currentIndex = all_id.findIndex((i: string) => i == selectedId);
        setLoadingDelete(true);
    
       
          if (all_id.length >= 2 && res.status === 200) {
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

          setTimeout(() => {
            setLoadingDelete(false);
          }, 2000);
      };
    


 
    return (
      <>
      <HeaderNotes length={counterNotes}/> 
     {body &&
       body.map((item: ILinks, i:number) => {
        if(loadingDelete && deleleElement === item._id ) {
          return <> </>
        } else {
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
          )
        }
           
         
       })}
       
   </>
  )
}


export default List;