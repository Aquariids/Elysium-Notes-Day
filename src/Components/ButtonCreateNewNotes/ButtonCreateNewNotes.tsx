import { emptyRawContentState } from "contenido";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NOTES } from "../../../pages/api/paths";
import s from "./ButtonCreateNewNotes.module.scss";
import LoaderCreate from "./LoaderCreate";
import { create_data } from "../../../pages/api/actios";
import { DateTime } from 'luxon';
import { Settings } from 'luxon';
Settings.defaultLocale = 'ru';
DateTime.local().setLocale('ru');
interface IButton {
  alert?: "alert";
}
const ButtonCreateNewNotes = ({ alert }: IButton) => {
  const { data: session } = useSession();
  // emptyRawContentState - пустой объект содержимого draft js. Превращаем его в JSON и отправляем в базу
  const [load, setLoad] = useState(true);
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
      code:false,
      date:userDate.toJSDate(),
      dateFull:userDate.toFormat("EEEE, d MMMM yyyyг, HH:mm"),
      dateShort:userDate.toFormat("d MMMM").length === 11 ? userDate.toFormat("d MMMM").slice(0,6) : userDate.toFormat("d MMMM").slice(0,5) + '.',
    };

    try {
      setLoad(false);
      const response = await fetch(`/api/createData?action=${create_data.create_data}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      router.push(`/${NOTES}/${responseData._id}`);
    } catch (error) {
      console.error("Failed to create note");
      console.error(error);
    }
  };

  useEffect(() => {
    setLoad(true);
  }, [router]);

  if (alert === "alert") {
    return (
      <Link className={s.alert} onClick={create} href={""}>
        +
      </Link>
    );
  }
   else {
    return load ? (
      <button className={s.btn} onClick={create}>
        +
      </button>
    ) :(
      <>
      {  router.asPath !== '/' && <LoaderCreate />}
      </>
    
    );
  }
};

export default ButtonCreateNewNotes;
