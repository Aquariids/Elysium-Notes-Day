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
  

  if (!dataClient) {
    return (
      <>
        <List body={dataServer} userId={userId} email={email} />;
      </>
    )
  } else {
    return (
      <>
        <List
          loadingDelete={loadingDelete}
          deleteElement={deleteElement}
          body={dataClient}
          userId={userId}
          email={email}
        />
      
      </>
    );
  }
};

export default NotesList;
