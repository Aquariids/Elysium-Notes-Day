import { emptyRawContentState } from "contenido";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { NOTES } from "../../../pages/api/paths";
import s from "./ButtonCreateNewNotes.module.scss";
import LoaderCreate from "./LoaderCreate";
import { create_data_action, get_action, update_action } from "../../../pages/api/actions";
import { DateTime } from 'luxon';
import { Settings } from 'luxon';
import Plus from './plus.svg';
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
 const [idPage, setIdPage] = useState();


  async function getId () {
    const idPageForBooks = await fetch(
      `/api/getData?action=${get_action.get_active_notebook}&userId=${session?.user.userId}&email=${session?.user.email}`
    );
    const [idpage] = await idPageForBooks.json();

    setIdPage(idpage)
  }
  const updateBookForNotes = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/updateData?action=${update_action.update_active_notebook}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId:session?.user.userId,
            email:session?.user.email,
            book: 'all',
          }),
        }
      );

      
    } catch (err) {
      console.error(err);
    }
  }, []);


  useEffect(() => {
    getId();
  },[router])



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
      idPage: router.asPath === '/' ? 'all': String(idPage && idPage),
      deleteDate: ''
    };


 
  
    try {
      setLoad(false);
      const response = await fetch(`/api/createData?action=${create_data_action.create_user_note}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      if(router.asPath === '/') {
        updateBookForNotes()
        router.push(`/${NOTES}/${responseData._id}`);
      } else {
        router.push(`/${NOTES}/${responseData._id}`);
      }
     
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
      <button className={s.alert} onClick={create} >
         <Plus/>
      </button>
    );
  }
   else {
    return load ? (
      <button className={s.btn} onClick={create}>
        <Plus/>
      </button>
    ) :(
      <>
      {  router.asPath !== '/' && <LoaderCreate />}
      </>
    
    );
  }
};

export default ButtonCreateNewNotes;
