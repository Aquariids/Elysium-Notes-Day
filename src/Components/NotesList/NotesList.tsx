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
import List from "./List";
const NotesList = ({data, body, userId, recycle }: any) => {
  const router = useRouter();
  const selectedId = router.query.index;
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
 
 

  
   
  if(!data) {
    return (
      <List body={body}userId={userId} counterNotes={counterNotes} />
     );
   
  } else {
    return (
      <List body={data}userId={userId} counterNotes={counterNotes} />
     );
   
  }
  
   }



export default NotesList;
