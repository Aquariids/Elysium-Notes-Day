import React from "react";
import List from "./List";
const NotesList = ({
  data,
  body,
  userId,
  email,
  deleteElement,
  loadingDelete,
}: any) => {

  if (!data) {
    return <List body={body} userId={userId} email={email} />;
  } else {
    return (
      <List
        loadingDelete={loadingDelete}
        deleteElement={deleteElement}
        body={data}
        userId={userId}
        email={email}
      />
    );
  }
};

export default NotesList;


