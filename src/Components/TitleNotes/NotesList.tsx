import React, { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import s from "./NotesList.module.scss";
import Link from "next/link";
import { useSession } from "next-auth/react";
import cn from "classnames";
import { ILinks } from "./NotesList.props";
import { convertFromRaw, EditorState } from "draft-js";
const NotesList = ({ body, checkTitle,id }: any) => {
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
        `/api/getAllData?userId=${userId}&email=${email}`,{ next: { revalidate: 10 } }
      );
      const data = await res.json();
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

    const res = await fetch(`/api/deleteData?_id=${linkId}&userId=${userId}`);
   
   

      if (all_id.length >= 2) {
        if (linkId != selectedId) {
          router.push(all_id[currentIndex]);
          console.log('да');
        } else if (
          linkId === selectedId &&
          all_id[currentIndex + 1] === undefined
        ) {
          router.push(all_id[currentIndex - 1]);
          console.log('да');
          
        } else {
          console.log('да');
          router.push(all_id[currentIndex + 1]);
        }
      } else if (all_id.length === 1) {
        router.push("/mainPage");
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
    if(plainText.length >= 125) {
      const text = plainText.slice(0, 125) + '...'
      return text;
    } else {
      return plainText
    }
    
  }

  if (loadingData || loadingDelete) {
    // да это тупая тема, я на 2 секунды подгружаю данные из getServerSideProps, а потом гружу уже данные из fetch на клиенте.
    // но таким образом я избавился от некоторых мелкий визуальных багов с удалением постов
    // а также отображаю их  без подгрузок и тп тд. Делаю как могу кастылю как могу.
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
                <button disabled className={cn(s.delete_btn, {
                  [s.show]: selectedId === item._id,
                })}></button>
                <Link className = {
                  cn(s.link, {
                    [s.blockLink]: selectedId === item._id,
                  })
                }  href={`/mainPage/${item._id}`}>
                  <div className={s.title_link}>
                    {item.title ? item.title : "Без названия"}
                  </div>
                  <p className={s.body_link}> {DraftJsObjectInText(item.body)} </p>
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
            return (
              <div
                key={item._id}
                className={cn(s.block_link, {
                  [s.active]: selectedId === item._id,
                })}
              >
                <button
                 className={cn(s.delete_btn, {
                  [s.show]: selectedId === item._id,
                })}
                  onClick={() => handleDeleteLink(selectedId)}
                ></button>
                <Link className = {
                  cn(s.link, {
                    [s.blockLink]: selectedId === item._id,
                  })
                }  href={`/mainPage/${item._id}`}>
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
