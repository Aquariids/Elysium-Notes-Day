import React, { useEffect, useState } from "react";
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
//   const [test1,setTest1] = useState<any>();

// useEffect(() => {
// const a = localStorage.getItem('test');

// setTest1(a)
// },[])
// const data1 = data && data.filter((item)=> {
//  if(item.idPage === test1) {
//   return item
//  } 
// if(test1 === 'all') return item
  
// })

// console.log(data1);



  if (!data) {
    return <List body={body} userId={userId} email={email} idPage={  idPage} />;
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


