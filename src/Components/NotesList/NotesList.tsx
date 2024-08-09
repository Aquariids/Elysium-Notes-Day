import React, { useEffect, useMemo, useState } from "react";
import s from './NotesList.module.scss';
import List from "./List";
import Fuse from "fuse.js";
const NotesList = ({
  dataClient,
  dataServer,
  userId,
  email,
  deleteElement,
  loadingDelete,
}: any) => {
  
  if (!dataClient || dataClient.length === 0) {
    return <></>; // Возвращаем null, если нет данных
  }
  
  if (dataClient) {



    // {dataClient && dataClient.map(()=> {


    //   <ListLine />
    // })}
   
    return (
     
      <List
        loadingDelete={loadingDelete}
        deleteElement={deleteElement}
        body={dataClient}
        userId={userId}
        email={email}
      />
    
    
    )
  } 
};

export default NotesList;
