import React from "react";
import List from "./List";
const NotesList = ({
  data,
  body,
  userId,
  email,
  deleteElement,
  loadingDelete,
  idPage
}: any) => {
  console.log("🚀 ~ file: NotesList.tsx:12 ~ idPage:", idPage)

  if (!data) {
    return <List body={body} userId={userId} email={email}   idPage={  idPage} />;
  } else {
    return (
      <List
        loadingDelete={loadingDelete}
        deleteElement={deleteElement}
        body={data}
        userId={userId}
        email={email}
        idPage={idPage}
      />
    );
  }
};

export default NotesList;


