import { getSession } from "next-auth/react";
import React, { useState } from "react";
import { withLayout } from "../../layout/Layout";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { useRouter } from "next/router";
import s from "./mainPage.module.scss";
import Error404 from "../Error404";
import Link from "next/link";

const MainPage = ({ data }: any) => {
  const router = useRouter();
  const selectedId = router.query.index;
  const all_id = data.map((obj: { _id: any }) => obj._id);

  const handleDeleteLink = async (linkId: any) => {
    const res = await fetch(`/api/deleteData?_id=${linkId}`);
    await all_id.filter((link: any) => link !== linkId);

      async function handle() {

        const currentIndex = all_id.findIndex((i: string) => i == selectedId);
        console.log("🚀 ~ file: [index].tsx:23 ~ handle ~ currentIndex:", currentIndex)
   
        if( all_id.length >= 2 ) {
          if (linkId != selectedId ) {
            router.push(all_id[currentIndex]);
          }
           else if(linkId === selectedId && all_id[currentIndex + 1] === undefined) {
            router.push(all_id[currentIndex - 1]);
           } else {
            router.push(all_id[currentIndex + 1]);
           }
        
        } else if (all_id.length === 1) {
          router.push('/mainPage');
        } 
        else {
          alert('ЧЕ ТО ТЫ НЕ ТО ДЕЛАЕШЬ')
        }
      }
     

      handle();

   
    //  if (all_id[currentIndex - 2] == undefined && all_id.length !== 1) {
    //    router.push(all_id[currentIndex - 1]);
    //  } 
    //  if (all_id[currentIndex + 2] == undefined && all_id.length !== 1) {
    //    router.push(all_id[currentIndex + 1]);
    //  }
  
   
   


 



    


  };

  // это наш path по сути url
  const selectedItem = data.find(
    (item: { _id: string }) => item._id === selectedId
  ); // ищем в нашем массиве первый _id попавший под услвоие. То есть если он равен id из url

  // if (!selectedItem) {
  //   return <Error404 />;
  // } else {
  return (
    // ну и паередаем его в наш редактор.
    <div className={s.wrapper}>
      <div className={s.container}>
        {all_id &&
          all_id.map((item: any, i: any) => {
            return (
              <React.Fragment key={item}>
                <Link
                  {...(selectedId === item ? { style: { color: "red" } } : "")}
                  href={`/mainPage/${item}`}
                >
                  <div>{`Новая заметка ${i}`}</div>
                </Link>
                <button onClick={() => handleDeleteLink(item)}>Удалить</button>
              </React.Fragment>
            );
          })}
      </div>
      {selectedItem && (
        <CustomEditor
          body={selectedItem.body}
          key={selectedItem._id}
          id={selectedItem._id}
        />
      )}
    </div>
  );
};
// };

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const userId = session?.user.userId; // айди авторизованного человека
  const email = session?.user.email;
  const res = await fetch(
    `${process.env.DOMAIN}/api/getAllData?userId=${userId}&email=${email}`
  ); // тут наверное лучше сразу сделатьт запрос к нужному документу, а не все грузить
  const data = await res.json();

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { data },
  };
}

export default withLayout(MainPage);


