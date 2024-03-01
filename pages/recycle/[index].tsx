import React, { useCallback, useEffect, useMemo, useState } from "react";
import { withLayout } from "../../layout/Layout";
import CustomEditor from "@/Components/CustomEditor/CustomEditor";
import { useRouter } from "next/router";
import s from "../notes/notes.module.scss";
import NotesList from "@/Components/NotesList/NotesList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { RECYCLE } from "../api/paths";
import { useSession } from "next-auth/react";
import HeaderNotes from "@/Components/HeaderNotes/HeaderNotes";
import { get_action, update_action } from "../api/actios";
import AnimationContainer from "@/Components/AnimationContainer/AnimationContainer";
import { sorting } from "../../utils/sorting";
import { getAllNotesFromDatabaseRecycle } from "../api/auth/lib/Get";
const notes = ({ data, all_id}: any) => {
  const [sort, setSort] = useState<any>("no-sort");
  const [checkTitle, setCheckTitle] = useState(false); // ну тупая хуета, да. короче перекидывю шнягу в редактор и лист где все заметки
  // суть такая, что заголовок я меняю в редакторе, это передаю на сервер, потом проверяю checkTitle, если он менялся, значит меняю заголовок и в  NotesList. Вот и все.
  const router = useRouter();
  const selectedId = router.query.index;
  const session = useSession();
  const userId = session.data?.user.userId;
  const email = session.data?.user.email;
  // это наш path по сути текущий url = _id человека
  const selectedItem = useMemo(
    // с помощью useMemo уменьшаю кол рендеров
    () =>
      data.find((item: { _id: string }) => {
        return item._id === selectedId;
      }),
    [data, selectedId]
  );


  const updateActiveSortingAction = useCallback(
    async (sorting: any, userId: any, email: any) => {
      try {
        const response = await fetch(
          `/api/updateData?action=${update_action.action_sorting}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              email,
              sorting: sorting,
            }),
          }
        );
      } catch (error) {
        console.log(
          "🚀 ~ file: CustomEditor.tsx:66 ~ updateData ~ error:",
          error
        );
      }
    },
    []
  );
  useEffect(() => {
    const sort = localStorage.getItem("sorting");
    setSort(sort);
    updateActiveSortingAction(sort,userId,email);
    
  }, [sort]);
  useEffect(() => {
    if (!selectedItem) {
      router.push(`/${RECYCLE}`);
    }
  }, [router]);

  return (
    // ну и паередаем его в наш редактор.
    <AnimationContainer> 
    <div className={s.wrapper}>
   
      <div className={s.notes_list}>
      <HeaderNotes setSort={setSort} sort={sort} data={data} />
        <div className={s.container}>
          <div className={s.list}>
            {data[0] && (
              <NotesList
                recycle={true}
                checkTitle={checkTitle}
                body={data ? sorting(data, sort): ''}
                userId={userId}
              />
            )}
          </div>
        </div>
      </div>
      <div className={s.editor}>
        {selectedItem && (
          <CustomEditor
          all_id={all_id}
          checkTitle={checkTitle}
          setCheckTitle={setCheckTitle}
          key={selectedItem._id}
          selectedItem={selectedItem}
        />
        )}
      </div>
     
    </div>
    </AnimationContainer> 
  );
};

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  try {
    if (!session) {
      return {
        redirect: {
          destination: "/",
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

 
  let all_id = serializedData && serializedData.map((obj: { _id: string }) => obj._id);

  return {
    props: { data:serializedData, all_id },
  };

} catch(err) {
  return {porps:{}}
  
}
}

export default withLayout(notes);
