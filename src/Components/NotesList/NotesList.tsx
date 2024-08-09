import React from "react";
import List from "./List";
import { INotesList } from "./NotesList.props";
const NotesList = ({
  dataClient,
  userId,
  email,
  deleteElement,
  loadingDelete,
}: INotesList) => {
  console.log("🚀 ~ deleteElement:", deleteElement)
  console.log("🚀 ~ loadingDelete:", loadingDelete)
  
  
    return (
      <List
        loadingDelete={loadingDelete}
        deleteElement={deleteElement}
        body={dataClient}
        userId={userId}
        email={email}
      />
    
    )
  
};

export default NotesList;
