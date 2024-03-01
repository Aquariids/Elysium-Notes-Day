import React, { useState } from "react";
import { withLayout } from "../../layout/Layout";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { useRouter } from "next/router";
import s from "../notes/notes.module.scss";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { RECYCLE } from "../api/paths";
import { get_action } from "../api/actios";
import { getActionSorting, getAllNotesFromDatabaseRecycle } from "../api/auth/lib/Get";

const MainPage = ({ data }: any) => {
  const [checkTitle, setCheckTitle] = useState(false); // ну тупая хуета, да. короче перекидывю шнягу в редактор и лист где все заметки
  // суть такая, что заголовок я меняю в редакторе, это передаю на сервер, потом проверяю checkTitle, если он менялся, значит меняю заголовок и в  NotesList. Вот и все.
  const router = useRouter();
  const selectedId = router.query.index;

  // это наш path по сути текущий url = _id человека
  const selectedItem = data.find(
    (item: { _id: string }) => item._id === selectedId
  ); // ищем в нашем массиве первый _id попавший под услвоие. То есть если он равен id из url

  return (
    // ну и паередаем его в наш редактор.
    <div className={s.wrapper}>
      <div className={s.notes_list}>
        <div className={s.container}>
          <div className={s.alert}>
            <h2> Корзина пуста</h2>
            Если в корзине есть заметки, нажмите на «...», чтобы восстановить
            или удалить их.
          </div>
        </div>
      </div>
      <div className={s.editor}>
        {selectedItem && (
          <CustomEditor
            checkTitle={checkTitle}
            setCheckTitle={setCheckTitle}
            title={selectedItem.title}
            body={selectedItem.body}
            key={selectedItem._id}
            id={selectedItem._id}
          />
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
 

  try {

    if (!session) {
      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
      };
    }
    const user_id:string = session?.user.userId; // айди авторизованного человека
    const email:string = session?.user.email;
    const responseRecyclerData = await getAllNotesFromDatabaseRecycle(user_id, email)
    const serializedData:any = responseRecyclerData?.map((item) => ({ // "сериализуем" данные, и делаем из objectId у mongodb обычную строку, смотрим, что названиме тоже изменилось
      ...item,
      _id: item._id.toString(), 
   
    }));

    // console.log(serializedData);
    


  const sort:any = await getActionSorting(user_id, email);

  
  if (session && serializedData[0] != undefined && sort[0].sorting === 'dateDown') {
    return {
      redirect: {
        destination: `/${RECYCLE}/${serializedData[0]._id}`,
        permanent: false,
      },
    };
  } if (session && serializedData[0] != undefined && sort[0].sorting === 'dateUp') {
    return {
      redirect: {
        destination: `/${RECYCLE}/${serializedData[serializedData.length - 1]._id}`,
        permanent: false,
      },
    };
  }  
  else if(session && serializedData[0] != undefined) {
    return {
      redirect: {
        destination: `/${RECYCLE}/${serializedData[0]._id}`,
        permanent: false,
      },
       props:{ serializedData}
    };
  }  
  
  return {
    props:{ data:serializedData}
  }
  } catch(err) {
    return {
      porps:{}
    }
    
  }
}

export default withLayout(MainPage);
