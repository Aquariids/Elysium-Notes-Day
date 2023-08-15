import Link from "next/link";
import { DraftJsObjectInText, ILinks, sliceTitle } from "./NotesList.props";
import s from './NotesList.module.scss';
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import cn from 'classnames';
import { NOTES } from "../../../pages/api/paths";

const List = ({body,loadingDelete,deleteElement}:any) => {
const router = useRouter();
const routerRecycle = router.asPath.split('/')[1];
const selectedId = router.query.index;



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
        if(loadingDelete && deleteElement === item._id ) {
          return <> </>
        } else {
          return (
            <div
             key={item._id}
             className={cn(s.block_link, {
               [s.active]: selectedId === item._id,
            
             })}
           >
            <Link rel="preload" className = {
               cn(s.link, {
                 [s.blockLink]: selectedId === item._id,
               })
             }  href={`/${routerRecycle ? routerRecycle: NOTES}/${item._id}`}>
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