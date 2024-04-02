import React, { useEffect } from "react";
import List from "./List";
const NotesList = ({
  dataClient,
  dataServer,
  userId,
  email,
  deleteElement,
  loadingDelete,
}: any) => {
 




  if (!dataClient) {
    return <List body={dataServer} userId={userId} email={email} />;
  } else {
    
    return (
      <List
        loadingDelete={loadingDelete}
        deleteElement={deleteElement}
        body={dataClient}
        userId={userId}
        email={email}
      />
    );
  }
};

export default NotesList;