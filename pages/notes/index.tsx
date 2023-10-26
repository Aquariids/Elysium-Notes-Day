import { withLayout } from "../../layout/Layout";
import s from "./notes.module.scss";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { NOTES } from "../api/paths";
import ButtonCreateNewNotes from "@/Components/ButtonCreateNewNotes/ButtonCreateNewNotes";
import { get_action } from "../api/actios";
import ModalBooks from "@/Components/CustomEditor/ModalBooks/ModalBooks";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Book from './book.svg';
import cn from 'classnames';
const index = ({userid, email, idpage, databook}:any) => {
 
  const session = useSession();
  const [activeModal, setActiveModal] = useState(false);
  
  const name = useMemo(() => {
    if (databook) {
      const matchingItem = databook.find((item:any) => {
        return item.idPage == idpage
      })
      if (matchingItem) {
        return matchingItem.name;
      }
    }
    return 'all'; // или другое значение по умолчанию, если совпадений нет
  }, [idpage, databook]);


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
            <span className={s.tooltip}><Book/> <span>{idpage === 'all' ? "Всe": name && name}</span></span>
          </p>
      <ModalBooks
      userId= {userid}
      email ={email}
            session={session}
            active={activeModal}
            setActive={setActiveModal}
          />
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userid = session?.user.userId; // айди авторизованного человека
  const email = session?.user.email;

  
  
  try {

    const idPageForBooks = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.id_for_books}&userId=${userid}&email=${email}`
    );
    const [idpage] = await idPageForBooks.json();
    const res = idpage === 'all' ? await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.data_editor}&userId=${userid}&email=${email}`
    ): await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.data_editorBook}&userId=${userid}&email=${email}&idPage=${idpage}`
    );
    const actionSorting = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.action_sorting}&userId=${userid}&email=${email}`
    ); 
 
    const resBook = await fetch(
      `${process.env.DOMAIN}/api/getData?action=${get_action.id_page_book}&userId=${userid}&email=${email}`
    );
    const databook = await resBook.json();
  
  const sort = await actionSorting.json();
  const data = await res.json();

  
  if(!session){
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }
  if (session && data[0] != undefined && sort[0].sorting === 'dateDown') {
    return {
      redirect: {
        destination: `/${NOTES}/${data[0]._id}`,
        permanent: false,
      },
    };
  } if (session && data[0] != undefined && sort[0].sorting === 'dateUp') {
    return {
      redirect: {
        destination: `/${NOTES}/${data[data.length - 1]._id}`,
        permanent: false,
      },
    };
  }  

  else if(session && data[0] != undefined) {
    return {
      redirect: {
        destination: `/${NOTES}/${data[0]._id}`,
        permanent: false,
      },
       props:{ data}
    };
  }  
  
  return {
    props:{ data,databook,idpage, userid,email}
  }
  }

  catch(err) {
    console.error(err);
    
  }
  
}

export default withLayout(index);
