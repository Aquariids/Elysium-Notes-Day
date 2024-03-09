import { emptyRawContentState } from "contenido";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NOTES } from "../../../pages/api/paths";
import s from "./ButtonCreateNewNotes.module.scss";
import AddNotes from "./add_notes.svg";
import { create_data_action, update_action } from "../../../pages/api/actions";
import { DateTime } from 'luxon';
import { Settings } from 'luxon';
import { useCallback } from "react";
Settings.defaultLocale = 'ru';
DateTime.local().setLocale('ru');
const ButtonCreateNewNotes = ({email, userId}:any) => {
  const { data: session } = useSession();
  // emptyRawContentState - пустой объект содержимого draft js. Превращаем его в JSON и отправляем в базу
  const router = useRouter();

  const updateBookForNotes = useCallback(async (idForBook: any) => {
    try {
      const response = await fetch(
        `/api/updateData?action=${update_action.update_active_notebook}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            email,
            book: idForBook,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        router.push(router.asPath);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);
  const create = async () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userDate = DateTime.now().setZone(userTimeZone);
    const content = JSON.stringify(emptyRawContentState);
    updateBookForNotes("all");
    const data = {
      userId: session?.user.userId,
      email: session?.user.email,
      body: content, // данные редактора
      title: "",
      block: false,
      code:false,
      date:userDate.toJSDate(),
      dateFull:userDate.toFormat("EEEE, d MMMM yyyy HH:mm"),
      dateShort:userDate.toFormat("d MMMM").slice(0, 5) + '.',
    };

    try {
      const response = await fetch(
        `/api/createData?action=${create_data_action.create_user_note}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      router.push(`/${NOTES}/${responseData._id}`);
    } catch (error) {
      console.error("Failed to create note");
      console.error(error);
    }
  };

  return (
    <button className={s.add_notes} onClick={create}>
      <AddNotes />
    </button>
  );
};

export default ButtonCreateNewNotes;
