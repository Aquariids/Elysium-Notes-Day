import React, { useEffect, useState } from "react";
import List from "./List";
import { useRouter } from "next/router";
const NotesList = ({
  data,
  body,
  userId,
  email,
  deleteElement,
  loadingDelete,
}: any) => {
  const router = useRouter();
  const [sortDate, setSortDate] = useState<string | null>();
  const [sortbody, setSortBody] = useState();
  // сортировка данных с сервера. В общем тупо и коротко, я вместо лоадера использую данные с сервера, то есть показываю заметки с сервера, а потом заменяю их на клиент компонент.
  // Когда я сортирую мне очевидно нужно отсортировать и на сервере данные, это я делаю тут перед тем как отобразить все. А данные с клиента я сортирую, в api передаваю action в url у fetch.
  // в общем дрочь какая то - если так подумать, я данные с серва сортирую в клиента, а данные с клиента сортирую на серве, что? че за нахуй. что я делаю вообще.
  useEffect(() => {
    const sort = localStorage.getItem("sorting");
    setSortDate(sort);
  }, []);



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
