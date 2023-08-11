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
const routerRecycle = router.asPath.split('/')[1];
const selectedId = router.query.index;
const [loadingDelete, setLoadingDelete] = useState(false);
const [deleteElement, setDeleteElement] = useState<any>();
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
      <div className={s.d}>
      <HeaderNotes length={counterNotes}/> 
      </div>
      
     {body &&
       body.map((item: ILinks, i:number) => {
        if(loadingDelete && deleteElement === item._id ) {
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