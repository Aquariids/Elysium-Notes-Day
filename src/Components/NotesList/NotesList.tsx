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
 // пусть этот комментарий будет напоминанием как я не мог сделать простейщую сортировку и тупил как дурак, делал ее где то на сервере, где то на клиенте. в итоге надо было просто делать там где я получаю все данные, логично же дима? идиот.


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
