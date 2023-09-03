import React, { useEffect, useState } from "react";
import List from "./List";
const NotesList = ({ data, body, userId, email, deleteElement, loadingDelete }: any) => {
const [sortDate, setSortDate] = useState<string | null>();
// сортировка данных с сервера. В общем тупо и коротко, я вместо лоадера использую данные с сервера, то есть показываю заметки с сервера, а потом заменяю их на клиент компонент.
// Когда я сортирую мне очевидно нужно отсортировать и на сервере данные, это я делаю тут перед тем как отобразить все. А данные с клиента я сортирую, в api передаваю action в url у fetch.
// в общем дрочь какая то - если так подумать, я данные с серва сортирую в клиента, а данные с клиента сортирую на серве, что? че за нахуй. что я делаю вообще.
  useEffect(() => {
    const sort = localStorage.getItem('sorting'); 
    setSortDate(sort)
  },[])

  // useEffect(()=>  {
    
    
  // },  [])
  function sortBody (body:any) {
    switch(sortDate) {
      case 'date':
        const bodySortDate = body.sort((a: any, b: any) => {
          const dateA = Date.parse(a.date);
          const dateB = Date.parse(b.date);
          console.log();
          
          return dateB - dateA; // Сравниваем в обратном порядке для сортировки от новых к старым
        });
        return bodySortDate;
      // case 'no-date':
      // return data;
    }


    return body
  }


  if (!data) {
    return <List body={sortBody(body)} userId={userId} email={email} />; 
  } else {
    return <List loadingDelete={loadingDelete} deleteElement={deleteElement} body={sortBody(data)} userId={userId} email={email} />;
  }
};

export default NotesList;
