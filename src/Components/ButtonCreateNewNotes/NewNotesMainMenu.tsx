import { emptyRawContentState } from "contenido";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NOTES } from "../../../pages/api/paths";
import s from "./ButtonCreateNewNotes.module.scss";
import AddNotes from "./add_notes.svg";
import { create_data } from "../../../pages/api/actios";
import { DateTime } from 'luxon';
import { Settings } from 'luxon';
Settings.defaultLocale = 'ru';
DateTime.local().setLocale('ru');
const ButtonCreateNewNotes = () => {
  const { data: session } = useSession();
  // emptyRawContentState - пустой объект содержимого draft js. Превращаем его в JSON и отправляем в базу
  const router = useRouter();
  const create = async () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userDate = DateTime.now().setZone(userTimeZone);
    const content = JSON.stringify(emptyRawContentState);
    const data = {
      userId: session?.user.userId,
      email: session?.user.email,
      body: content, // данные редактора
      title: "",
      block: false,
      date:userDate.toJSDate(),
      dateFull:userDate.toFormat("EEEE, d MMMM yyyy HH:mm"),
      dateShort:userDate.toFormat("d MMMM").slice(0, 5) + '.',
    };

    try {
      const response = await fetch(
        `/api/createData?action=${create_data.create_data}`,
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
