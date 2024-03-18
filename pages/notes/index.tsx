import { withLayout } from "../../layout/Layout";
import s from "./notes.module.scss";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { NOTES } from "../api/paths";
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import ModalBooks from "@/Components/CustomEditor/ModalBooks/ModalBooks";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Book from "./book.svg";
import cn from "classnames";
import {
  getSortingPreferences,
  getAllUserNotes,
  getActiveNotebook,
  getAllUserNotebook,
  getUserNotesFromNotebook, 
  getActiveNotebookWithoutId,
} from "../api/auth/lib/Get";
const index = ({ user_id, email, idpage, data_nootebook }: notes_data & Record<string, unknown>) => {
  const session = useSession();
  const [activeModal, setActiveModal] = useState(false);

  const name = useMemo(() => {
    if (data_nootebook) {
      const matchingItem = data_nootebook.find((item: any) => {
        return item.idPage == idpage;
      });
      if (matchingItem) {
        return matchingItem.name;
      }
    }
    return "all"; // или другое значение по умолчанию, если совпадений нет
  }, [idpage, data_nootebook]);

  return (
    // ну и паередаем его в наш редактор.
    <div className={s.wrapper}>
      <div className={s.notes_list}>
        <div className={s.container}>
          <div className={s.alert}>
            <h2>Создание первой заметки</h2>
            <div className={s.textBtn}>
              Нажмите на кнопку {<ButtonCreateNewNotes alert="alert" />} в
              боковой панели "Заметки" или здесь, чтобы начать.
            </div>
          </div>
        </div>
      </div>

      <div className={s.editor}>
        <p className={cn(s.nameBook)} onClick={() => setActiveModal(true)}>
          <span className={s.tooltip}>
            <Book /> <span>{idpage === "all" ? "Всe" : name && name}</span>
          </span>
        </p>
        <ModalBooks
          userId={user_id}
          email={email}
          session={session}
          active={activeModal}
          setActive={setActiveModal}
        />
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  try {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );

    if (!session) {
      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
      };
    }
    const user_id: string = session?.user.userId;
    const email: string = session?.user.email;
    const [idpage]: any = await getActiveNotebook(user_id, email);
    const [withoutId]: any = await getActiveNotebookWithoutId(user_id,email)

    if (user_id != undefined && email != undefined) {
      const responseEditorData =
        idpage === "all"
          ? await getAllUserNotes(user_id, email,withoutId)
          : await getUserNotesFromNotebook (user_id, email, idpage);
      const serializedData: any = responseEditorData?.map((item) => ({
        ...item,
        _id: item._id.toString(),
      
      }));

      const dataRes = await getAllUserNotebook(user_id, email)
      const data_nootebook = dataRes?.map((item) => ({
        ...item,
        _id: item._id.toString(),
      }));
      const sort: any = await getSortingPreferences(user_id, email);

      if (
        session &&
        serializedData[0] != undefined &&
        sort[0].sorting === "dateDown"
      ) {
        return {
          redirect: {
            destination: `/${NOTES}/${serializedData[0]._id}`,
            permanent: false,
          },
        };
      }
      if (
        session &&
        serializedData[0] != undefined &&
        sort[0].sorting === "dateUp"
      ) {
        return {
          redirect: {
            destination: `/${NOTES}/${
              serializedData[serializedData.length - 1]._id
            }`,
            permanent: false,
          },
        };
      } else if (session && serializedData[0] != undefined) {
        return {
          redirect: {
            destination: `/${NOTES}/${serializedData[0]._id}`,
            permanent: false,
          },
          props: { data: serializedData },
        };
      }

      return {
        props: { data: serializedData,  data_nootebook, idpage, user_id, email },
      };
    }
  } catch (err) {
    return { props: {} };
  }
}

export default withLayout(index);
